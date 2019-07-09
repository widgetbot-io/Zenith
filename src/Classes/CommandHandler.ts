import {Bot} from "../Bot";
import {Message} from "discord.js";
import {CommandHelper} from "./CommandHelper";
import {Ratelimit} from "./Ratelimit";
import {ICommand, IModule, RatelimitType} from "../interfaces";
import {ArgumentHelper} from "./ArgumentHelper";

export class CommandHandler {
	public ranCommands: {[key: string]: Message | Message[]} = {};
    private rateLimit: Ratelimit = new Ratelimit();
    constructor(private bot: Bot) {}

    static parseMessage(prefix: string, content: string) {
        const command = content.substr(prefix.length).split(' ')[0];
        const stringy = content.substr(command.length + (prefix.length));
        const args = stringy.split(' ');

        return {
            command,
            stringy,
            args
        }
    }

    async checkBlacklist(message: Message, userId: string, guildId: string): Promise<boolean> {
        if (!this.bot.driver) return false;

        const global = this.bot.driver.get('Blacklist', userId);
        const user = this.bot.driver.get(`Blacklist:${guildId}`, userId);

        return (!(global !== undefined || user !== undefined));
    }



    async handleMessage(message: Message) {
        if (!message.author) return;
        if (!message.cleanContent.startsWith(this.bot.settings.prefix)) return;

        const parsed = CommandHandler.parseMessage(this.bot.settings.prefix, message.cleanContent);
        const command: ICommand | undefined = Bot.commands.get(parsed.command.toLowerCase());
        if (!command) return;

        const module: IModule | undefined = Bot.modules.get(command.module.toLowerCase());
        if (!module || !module.module) return; // TODO: Throw error properly.

        if (await this.checkBlacklist(message, message.author.id, message.guild.id))
            return;

        if (await this.rateLimit.checkRatelimit(message.channel.id, message.author.id) === false) {
            return await message.channel.send('You are currently rate-limited!') // TODO: Implement proper replies fo different ratelimits
        }


        const argHelper = new ArgumentHelper(command, parsed, message.cleanContent,);
        const helper = new CommandHelper(message, this.bot, this.bot.client ,module.module, argHelper);

        if (this.bot.settings.roots.includes(message.author.id) || await command.hasPermission!(message)) {
            await this.rateLimit.increment(message.author.id, RatelimitType.USER);
            await this.rateLimit.increment(message.channel.id, RatelimitType.CHANNEL);

            await command.run!(helper);
        } else {
            // TODO: Handle no permission
        }
    }
}
