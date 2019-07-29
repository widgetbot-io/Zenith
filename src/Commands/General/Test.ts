import {Command, FlagArgument, FlagArgumentWithValue, OptionalArgument, RequiredArgument} from "../..";
import {CommandHelper} from "../../Classes";
import {Message} from "discord.js";
import {BaseCommand} from "../../interfaces";
import {General} from "../../Modules/General";

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
        await helper.message.channel.send(`You used the following flags: ${helper.argHelper.flags}`);
        await helper.message.channel.send(`You used the following non-flags: ${helper.argHelper.notFlags}`);
        await helper.message.channel.send(`depth: ${await helper.argHelper.get('depth')}`);
        await helper.message.channel.send(`one: ${await helper.argHelper.get('one')} \ntwo: ${await helper.argHelper.get('two')} \nthree: ${await helper.argHelper.get('three')}`);
    }

    async hasPermission(message: Message) {
        return true;
    }
}
