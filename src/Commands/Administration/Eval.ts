import {Command, Module} from "../../services/decorators";
import {BaseCommand} from "../../Classes/Command";
import {CommandHelper} from "../../Classes/CommandHelper";
import {Message} from "discord.js";
import * as util from "util";

@Command({
    name: 'Eval',
    description: 'Ping command',
    module: 'Administration'
})
export class Eval implements BaseCommand {
    async runCommand(helper: CommandHelper) {
        let res: any;
        const args = helper.message.content.split(' ').splice(1);
        const code = args.join(' ');

            try {
                res = await eval(`(async () => {${code}})()`);
                res = util.inspect(res, false, 0);
                await helper.message.channel.send(
                    `Input: \n \`\`\`js\n(async () => {\n${code}\n})()\`\`\`\n Async Output: \n \`\`\`js\n${res}\`\`\``
                );
            } catch (err) {
                await helper.message.channel.send(`\`\`\`js\n${err}\`\`\``);
            }
    }

    async hasPermission(message: Message) {
        return ['96626362277720064'].includes(message.author.id);
    }
}