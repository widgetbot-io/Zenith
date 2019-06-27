import {Client} from "../Client";
import {Message} from "discord.js";
import {CommandHelper} from "../Classes/CommandHelper";

interface Base {
    name: string,
    description: string
}
export interface Module extends Base {
    module: any
}
export interface Command extends Base {
    module: string,
    run?: (helper: CommandHelper) => Promise<void>;
    hasPermission?: (message: Message) => Promise<boolean>;
}

export function Module(info: Module): ClassDecorator {
    return function(Module: any) {
        const loaded = new Module();
        Client.modules.set(info.name, {
            ...info,
            module: loaded
        });
    }
}

export function Command(info: Command): ClassDecorator {
    return function(Command: any) {
        const loaded = new Command();
        Client.commands.set(info.name, {
            ...info,
            run: loaded.runCommand,
            hasPermission: loaded.hasPermission
        })
    }
}