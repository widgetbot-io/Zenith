import {Command, FlagArgument, FlagArgumentWithValue, OptionalArgument, RequiredArgument} from "../..";
import {CommandHelper} from "../../Classes";
import {GuildMember, Message} from "discord.js";
import {ArgumentType, BaseCommand} from "../../interfaces";
import {General} from "../../Modules";

@Command({
    name: 'Test',
    description: 'Test command',
    module: 'General',
    arguments: [
        new RequiredArgument({
            name: 'one',
            description: 'testing',
            type: ArgumentType.STRING
        }),
        new OptionalArgument({
            name: 'two',
            description: 'testing',
            type: ArgumentType.STRING
        }),
        new OptionalArgument({
            name: 'three',
            description: 'testing'
        }),
        new FlagArgumentWithValue({
            name: 'depth',
            description: 'testing'
        }),
        new FlagArgument({
            name: 'async',
            description: 'testing',
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
