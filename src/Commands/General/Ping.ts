import {Command, Module} from "../../services/decorators";
import {BaseCommand} from "../../Classes/Command";
import {CommandHelper} from "../../Classes/CommandHelper";
import {Message} from "discord.js";

@Command({
    name: 'Ping',
    description: 'Ping command',
    module: 'General'
})
export class Ping implements BaseCommand {
    async runCommand(helper: CommandHelper) {
        helper.message.channel.send('NANANANANANAANNA');
    }

    async hasPermission(message: Message) {
        return true;
    }
}