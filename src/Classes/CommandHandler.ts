import {Client} from "../Client";
import {Message} from "discord.js";
import {CommandHelper} from "./CommandHelper";
import {Ratelimit} from "./Ratelimit";
import {Command, RatelimitType} from "../interfaces";

export class CommandHandler {
	public ranCommands: {[key: string]: Message} = {};
    private rateLimit: Ratelimit = new Ratelimit();
    constructor(private client: Client) {}

    async handleMessage(message: Message) {
        if (!message.author) return;

        const command: Command = Client.commands.get(message.cleanContent.toLowerCase().split(' ')[0]);
        console.log(command);
        if (!command) return;

        const module = Client.modules.get(command.module.toLowerCase()).module;
        console.log(module);
        if (!module) return; // TODO: Throw error properly.

        if (await this.rateLimit.checkRatelimit(message.channel.id, message.author.id) === false) {
            return await message.channel.send('You are currently ratelimited!') // TODO: Implement proper replies fo different ratelimits
        }

        const helper = new CommandHelper(message, this.client, module, {});

        if (await command.hasPermission(message)) {
            await this.rateLimit.increment(message.author.id, RatelimitType.USER);
            await this.rateLimit.increment(message.channel.id, RatelimitType.CHANNEL);

            await command.run(helper);
        } else {
            // TODO: Handle no permission
        }
    }
}
