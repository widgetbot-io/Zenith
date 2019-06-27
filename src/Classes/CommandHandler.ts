import {Client} from "../Client";
import {Message} from "discord.js";
import {CommandHelper} from "./CommandHelper";
import {Command} from "../services/decorators";

export class CommandHandler {
    constructor(private client: Client) {}


    async handleMessage(message: Message) {
        if (!message.author) return;


        const command: Command = Client.commands.get('ping');
        if (!command) return;

        const module = Client.modules.get(command.module);
        if (!module) return; // TODO: Throw error properly.

        const helper = new CommandHelper(message, this.client, module, {});

        if (command.hasPermission(message)) {
            await command.run(helper);
        } else {
            // TODO: Handle no permission
        }
    }
}