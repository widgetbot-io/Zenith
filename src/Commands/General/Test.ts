import {Command, FlagArgument, FlagArgumentWithValue, RequiredArgument} from "../..";
import {CommandHelper} from "../../Classes";
import {Message} from "discord.js";
import {BaseCommand} from "../../interfaces";
import {General} from "../../Modules";

@Command({
    name: 'Test',
    description: 'Test command',
    module: 'General',
    arguments: [
        new RequiredArgument({
            name: 'one'
        }),
        new RequiredArgument({
            name: 'two'
        }),
        new RequiredArgument({
            name: 'three'
        }),
        new FlagArgumentWithValue({
            name: 'depth'
        }),
        new FlagArgument({
            name: 'async',
            short: 'a'
        })
    ]
})
export class Ping extends BaseCommand {
    async runCommand(helper: CommandHelper<{}, General>) {
        await helper.send(`
            \nYou used the following flags: ${helper.argHelper.flags}
            \nYou used the following non-flags: ${helper.argHelper.notFlags}
            \ndepth: ${await helper.argHelper.get('depth')}
            \none: ${await helper.argHelper.get('one')} \ntwo: ${await helper.argHelper.get('two')} \nthree: ${await helper.argHelper.get('three')}
            \nArgStr: ${await helper.argHelper.argString()}
            `
        );
    }

    async hasPermission(message: Message) {
        return true;
    }
}
