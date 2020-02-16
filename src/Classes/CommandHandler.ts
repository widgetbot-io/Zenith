import {Bot} from "../Bot";
import {Message} from "discord.js";
import {ArgumentHelper, CommandHelper, CommandLoader} from ".";
import {ICommand, IModule, Parsed} from "../interfaces";
import {Parser} from "./Parser";
import { EventEmitter } from "events";

export class CommandHandler extends EventEmitter {
	public ranCommands: {[key: string]: Message | Message[]} = {};
    // private rateLimit: RateLimit = new RateLimit(this.bot);
    constructor(private bot: Bot) { super() }

    static parseMessage(prefix: string, content: string): Parsed {
        const command = content.substr(prefix.length).split(' ')[0];
        const stringy = content.substr(command.length + (prefix.length));
        const args = Parser.parseArgs(stringy);

        return {
            command,
            stringy,
            args
        }
    }


    async handleMessage(message: Message) {
        if (!message.author) return;
        if (!message.cleanContent.startsWith(this.bot.settings.prefix)) return;

        const parsed = CommandHandler.parseMessage(this.bot.settings.prefix, message.content);
        const command: ICommand | undefined = await CommandLoader.get(parsed.command.toLowerCase());
        if (!command) return;

        const module: IModule | undefined = Bot.modules.get(command.module.toLowerCase());
        if (!module || !module.module) return; // TODO: Throw error properly.

        // if (await this.rateLimit.checkRatelimit(message, message.channel.id, message.author.id)) return;

        const argHelper = new ArgumentHelper(command, parsed, String(message.content), message);
        const helper = new CommandHelper(message, this.bot, this.bot.client, module.module, argHelper);
        module.module.helper = helper;

        if (this.bot.settings.roots.includes(message.author.id) || await command.hasPermission!(message, this.bot)) {
            // await this.rateLimit.increment(message.author.id, RatelimitType.USER);
            // await this.rateLimit.increment(message.channel.id, RatelimitType.CHANNEL);

            await command.run!(helper);
            this.emit('command', command)
        } else {
            // TODO: Handle no permission
        }
    }
}
