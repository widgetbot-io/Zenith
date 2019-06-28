import { Client } from '../Client';
import { Command, Module, Event } from '../interfaces';

export function Module(info: Module): ClassDecorator {
    return function(Module: any) {
        const loaded = new Module();
        Client.modules.set(info.name.toLowerCase(), {
            ...info,
            module: loaded
        });
    }
}

export function Event(info: Event): ClassDecorator {
    return function(Event: any) {
        const loaded = new Event();
        Client.events.set(info.name.toLowerCase(), {
            ...info,
            run: loaded.runCommand
        });
    }
}

export function Command(info: Command): ClassDecorator {
    return function(Command: any) {
        const loaded = new Command();
        Client.commands.set(info.name.toLowerCase(), {
            ...info,
            run: loaded.runCommand,
            hasPermission: loaded.hasPermission
        })
    }
}
