import {Command, FlagArgumentWithValue, RequiredArgument} from "../..";
import {CommandHelper} from "../../Classes";
import {Message} from "discord.js";
import * as util from "util";
import {BaseCommand} from "../../interfaces";
import {FlagArgument} from "../../Classes";
import {Administration} from "../../Modules";

@Command({
    name: 'Eval',
    aliases: ['ev'],
    description: 'Ping command',
    module: 'Administration',
    arguments: [
        new FlagArgument({
            name: 'async',
			short: 'a'
        }),
        new FlagArgumentWithValue({
            name: 'depth'
        }),
        new RequiredArgument({
            name: 'code'
        })
    ]
})
export class Eval extends BaseCommand {
    async runCommand(helper: CommandHelper<{}, Administration>) {
        let res: any;

        const code = await helper.argHelper.argString();
        console.log(code);
        const asyncFlag = await helper.argHelper.get('async');
        const depthFlag = await helper.argHelper.get('depth');

        if (asyncFlag) {
            try {
                res = await eval(`(async() => {${code}})()`);
                if (typeof res !== 'string')
                    res = util.inspect(res, false, depthFlag || 0);

                await helper.send(
                    `Input: \n \`\`\`js\n(async() => {${code}})()\`\`\`\n Async Output: \n \`\`\`js\n${res}\`\`\``
                );
            } catch (err) {
                await helper.send(`\`\`\`js\n${err}\`\`\``);
            }
        } else {
            try {
                res = eval(code);
                if (typeof res !== 'string')
                    res = util.inspect(res, false, depthFlag || 0);

                await helper.send(
                    `Input: \n \`\`\`js\n${code}\`\`\`\n Async Output: \n \`\`\`js\n${res}\`\`\``
                );
            } catch (err) {
                await helper.send(`\`\`\`js\n${err}\`\`\``);
            }
        }
    }

    async hasPermission(message: Message) {
        return ['96626362277720064', '242097488507568128'].includes(message.author!.id);
    }
}
