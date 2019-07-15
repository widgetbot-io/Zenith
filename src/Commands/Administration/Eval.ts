import { Command } from "../..";
import {CommandHelper} from "../../Classes";
import {Message} from "discord.js";
import * as util from "util";
import {BaseCommand} from "../../interfaces/command";
import {FlagArgument} from "../../Classes";

@Command({
    name: 'Eval',
    description: 'Ping command',
    module: 'Administration',
    arguments: [
        new FlagArgument({
            name: 'async',
			short: 'a'
        })
    ]
})
export class Eval extends BaseCommand {
    async runCommand(helper: CommandHelper) {
        let res: any;
        const args = helper.message.content.split(' ').splice(1);
        const code = args.join(' ');
            try {
                res = await eval(code);
                res = util.inspect(res, false, 0);
                await helper.send(
                    `Input: \n \`\`\`js\n${code}\`\`\`\n Async Output: \n \`\`\`js\n${res}\`\`\``
                );
            } catch (err) {
                await helper.send(`\`\`\`js\n${err}\`\`\``);
            }
    }

    async hasPermission(message: Message) {
        return ['96626362277720064'].includes(message.author!.id);
    }
}
