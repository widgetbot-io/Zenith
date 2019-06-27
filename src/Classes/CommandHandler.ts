import {Client} from "../Client";
import {Message} from "discord.js";
import {CommandHelper} from "./CommandHelper";
import {Command} from "../services/decorators";

export class CommandHandler {
    constructor(private client: Client) {}


    async handleMessage(message: Message) {
        if (!message.author) return;

        const command: Command = Client.commands.get(message.cleanContent);
        console.log(command);
        if (!command) return;

        const module = Client.modules.get(command.module.toLowerCase());
        console.log(module);
        if (!module) return; // TODO: Throw error properly.

        const helper = new CommandHelper(message, this.client, module, {});

        if (await command.hasPermission(message)) {
            await command.run(helper);
        } else {
            // TODO: Handle no permission
        }
    }
}