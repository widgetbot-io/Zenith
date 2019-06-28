import {Message} from "discord.js";
import {Client} from "../Client";
import {Module} from "../interfaces";

export class CommandHelper {
    constructor(public message: Message, public client: Client, public module: Module, public argHelper: any) {}

    async send(content: string): Promise<Message | Message[]> {
        return await this.message.channel.send(content);
    }
}
