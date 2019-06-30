import {Message} from "discord.js";
import {Bot} from "../Bot";
import {Module} from "../interfaces";
import {ArgumentHelper} from "./ArgumentHelper";

export class CommandHelper {
    constructor(public message: Message, public client: Bot, public module: Module, public argHelper: ArgumentHelper) {}

    public get channel() {
        return this.message.channel;
    }

    public get guild() {
        return this.message.guild;
    }

    public get author() {
        return this.message.author;
    }

    public async send(content: string): Promise<Message> {
        let message;

        if (this.client.commandHandler.ranCommands[this.message.id]) {
            const old: Message = this.client.commandHandler.ranCommands[this.message.id];
            message = await old.edit(content);
        } else {
            message = await this.message.channel.send(content);
        }

        this.client.commandHandler.ranCommands[this.message.id] = message;
        return message;
    }
}
