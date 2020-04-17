import {Bot} from "../Bot";
import {Message} from "discord.js";
import {ArgumentHelper, CommandHelper, CommandLoader} from ".";
import {ICommand, IModule, Parsed} from "../interfaces";
import {Parser} from "./Parser";
import {EventEmitter} from "events";

export class CommandHandler extends EventEmitter {
	public ranCommands: { [key: string]: Message } = {};
	// private rateLimit: RateLimit = new RateLimit(this.bot);
	constructor(private bot: Bot) { super(); }

	static async parseMessage(prefix: string, content: string): Promise<Parsed | null> {
		const name = content.substr(prefix.length).split(' ')[0];
		const command: ICommand | undefined = await CommandLoader.get(name.toLowerCase());
		if (!command) return null;
		const stringy = content.substr(name.length + (prefix.length));
		const args = Parser.parseArgs(stringy);

		return {
			command,
			stringy,
			args
		}
	}

	private getPrefix(content: string, prefix: string): string | false {
		return this.bot.settings.mentionPrefix ? content.startsWith(`<@${this.bot.user!.id}> `) && `<@${this.bot.user!.id}> `
			|| content.startsWith(`<@!${this.bot.user!.id}> `) && `<@!${this.bot.user!.id}> `
			|| content.startsWith(prefix) && prefix : content.startsWith(prefix) && prefix;
	}

	public async validCommand(message: Message) {
		if (!message.author) return;

		const prefix = this.getPrefix(message.content, this.bot.settings.prefix);
		if (!prefix) return;

		return await CommandHandler.parseMessage(prefix, message.content);
	}


	async handleMessage(message: Message) {
		const parsed = await this.validCommand(message);
		if (!parsed) return;

		const module: IModule | undefined = Bot.modules.get(parsed.command.module.toLowerCase());
		if (!module || !module.module) return; // TODO: Throw error properly.

		// if (await this.rateLimit.checkRatelimit(message, message.channel.id, message.author.id)) return;

		const argHelper = new ArgumentHelper(parsed.command, parsed, String(message.content), message);
		const helper = new CommandHelper(message, this.bot, this.bot.client, module.module, argHelper);
		module.module.helper = helper;

		if (this.bot.settings.roots.includes(message.author.id) || await parsed.command.hasPermission!(message, this.bot)) {
			// await this.rateLimit.increment(message.author.id, RatelimitType.USER);
			// await this.rateLimit.increment(message.channel.id, RatelimitType.CHANNEL);

			await parsed.command.run!(helper);
			this.emit('command', parsed.command);
		} else {
			// TODO: Handle no permission
		}
	}
}
