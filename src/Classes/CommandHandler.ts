import {Client} from "../Client";
import {Message} from "discord.js";
import {CommandHelper} from "./CommandHelper";
import {Ratelimit} from "./Ratelimit";
import {Command, RatelimitType} from "../interfaces";
import {ArgumentHelper} from "./ArgumentHelper";

export class CommandHandler {
	public ranCommands: {[key: string]: Message} = {};
    private rateLimit: Ratelimit = new Ratelimit();
    constructor(private client: Client) {}

    static parseMessage(prefix: string, content: string) {
        const command = content.substr(prefix.length).split(' ')[0];
        const stringy = content.substr(command.length + (prefix.length + 1));
        const args = stringy.split(' ');

        return {
            command,
            stringy,
            args
        }
    }


    async handleMessage(message: Message) {
        if (!message.author) return;

        if (!message.cleanContent.startsWith(this.client.settings.prefix)) return;


        const command: Command = Client.commands.get(message.cleanContent.toLowerCase().substr(this.client.settings.prefix.length).split(' ')[0]);
        if (!command) return;

        const module = Client.modules.get(command.module.toLowerCase()).module;
        if (!module) return; // TODO: Throw error properly.

        if (await this.rateLimit.checkRatelimit(message.channel.id, message.author.id) === false) {
            return await message.channel.send('You are currently ratelimited!') // TODO: Implement proper replies fo different ratelimits
        }

        const parsed = CommandHandler.parseMessage(this.client.settings.prefix, message.cleanContent);
        const argHelper = new ArgumentHelper(command, parsed, message.cleanContent,);
        const helper = new CommandHelper(message, this.client, module, argHelper);

        if (await command.hasPermission(message)) {
            await this.rateLimit.increment(message.author.id, RatelimitType.USER);
            await this.rateLimit.increment(message.channel.id, RatelimitType.CHANNEL);

            await command.run(helper);
        } else {
            // TODO: Handle no permission
        }
    }
}
