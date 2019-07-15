import {Command} from "../..";
import {CommandHelper} from "../../Classes";
import {Message} from "discord.js";
import {BaseCommand} from "../../interfaces/command";

@Command({
    name: 'Ping',
    description: 'Ping command',
    module: 'General'
})
export class Ping extends BaseCommand {
    async runCommand(helper: CommandHelper) {
        await helper.send('NANANANANANAANNA');
    }

    async hasPermission(message: Message) {
        return true;
    }
}
