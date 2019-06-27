import {Command, Module} from "../../services/decorators";
import {BaseCommand} from "../../Classes/Command";
import {CommandHelper} from "../../Classes/CommandHelper";
import {Message} from "discord.js";

@Command({
    name: 'Eval',
    description: 'Ping command',
    module: 'Administration'
})
export class Eval implements BaseCommand {
    async runCommand(helper: CommandHelper) {
        helper.message.channel.send('NANANANANANAANNA');
    }

    async hasPermission(message: Message) {
        return ['96626362277720064'].includes(message.author.id);
    }
}