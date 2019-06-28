import { Client } from '../Client';
import { Command, Module } from '../interfaces';

export function Module(info: Module): ClassDecorator {
    return function(Module: any) {
        const loaded = new Module();
        Client.modules.set(info.name.toLowerCase(), {
            ...info,
            module: loaded
        });
    }
}

export function Command(info: Command): ClassDecorator {
    return function(Command: any) {
        if (!info.module)
            throw new Error(`Command: ${info.name} must specify a module!`);
        const loaded = new Command();
        Client.commands.set(info.name.toLowerCase(), {
            ...info,
            run: loaded.runCommand,
            hasPermission: loaded.hasPermission
        })
    }
}
