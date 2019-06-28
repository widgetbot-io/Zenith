import {Command, Module} from "../../services/decorators";
import {CommandHelper} from "../../Classes/CommandHelper";
import {Message} from "discord.js";
import {BaseCommand} from "../../interfaces";

@Command({
    name: 'Ping',
    description: 'Ping command',
    module: 'General'
})
export class Ping implements BaseCommand {
    async runCommand(helper: CommandHelper) {
        await helper.send('NANANANANANAANNA');
    }

    async hasPermission(message: Message) {
        return true;
    }
}
