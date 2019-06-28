import {Message} from "discord.js";
import {Client} from "../Client";
import {Module} from "../interfaces";

export class CommandHelper {
    constructor(public message: Message, public client: Client, public module: Module, public argHelper: any) {}

    async send(content: string): Promise<Message> {
        let message;

        if (this.client.commandHandler.ranCommands[this.message.id]) {
            const old: Message = this.client.commandHandler.ranCommands[this.message.id];
            message = old.edit(content);
        } else {
            message = await this.message.channel.send(content);
        }

        this.client.commandHandler.ranCommands[this.message.id] = message;
        return message;
    }
}
