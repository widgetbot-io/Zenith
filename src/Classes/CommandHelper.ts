import {Message, MessageEmbed} from "discord.js";
import {Bot} from "../Bot";
import {ArgumentHelper} from "./ArgumentHelper";

export class CommandHelper<C, M> {
    constructor(public message: Message, public bot: Bot, public client: C, public module: M, public argHelper: ArgumentHelper) {}

    public get channel() {
        return this.message.channel;
    }

    public get guild() {
        return this.message.guild;
    }

    public get author() {
        return this.message.author;
    }

    public async send(content: string | MessageEmbed): Promise<Message> {
        let message;

        if (this.bot.commandHandler.ranCommands[this.message.id]) {
            const old = this.bot.commandHandler.ranCommands[this.message.id];
            // @ts-ignore
            message = await old.edit(content);
        } else {
            message = await this.message.channel.send(content);
        }

        // @ts-ignore
        this.bot.commandHandler.ranCommands[this.message.id] = message;

        // @ts-ignore
        return message;
    }

    public async sendTemp(content: string, timeout: number = 2500) {
        return await this.send(content).then(msg => {
            setTimeout(async () => {
                await msg.delete();
            }, timeout);
        })
    }
}
