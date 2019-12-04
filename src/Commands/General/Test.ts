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
        await helper.message.channel.send(`
            You used the following flags: ${helper.argHelper.flags} \n
            You used the following non-flags: ${helper.argHelper.notFlags} \n
            depth: ${await helper.argHelper.get('depth')} \n
            one: ${await helper.argHelper.get('one')} \\ntwo: ${await helper.argHelper.get('two')} \\nthree: ${await helper.argHelper.get('three')}
            `
        );
    }

    async hasPermission(message: Message) {
        return true;
    }
}
