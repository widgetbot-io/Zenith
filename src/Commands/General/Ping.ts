import {Command} from "../..";
import {CommandHelper} from "../../Classes";
import {Message} from "discord.js";
import {BaseCommand} from "../../interfaces";
import {General} from "../../Modules/General";

@Command({
    name: 'Ping',
    description: 'Ping command',
    module: 'General'
})
export class Ping extends BaseCommand {
    async runCommand(helper: CommandHelper<{}, General>) {
        const message = await helper.send(`Ping`);
        await message.edit(`Pong! Latency is ${message.createdTimestamp - helper.message.createdTimestamp}ms.`)
    }

    async hasPermission(message: Message) {
        return true;
    }
}
