import { Bot } from '../Bot';
import { Command, Module, Event } from '../interfaces';

export function Module(info: Module): ClassDecorator {
    return function(Module: any) {
        const loaded = new Module();
        if(Bot.modules.get(info.name.toLowerCase())) {
            console.warn(`Module ${info.name} already exists, overwriting..`)
        }

        Bot.modules.set(info.name.toLowerCase(), {
            ...info,
            module: loaded
        });
    }
}

export function Event(info: Event): ClassDecorator {
    return function(Event: any) {
        const loaded = new Event();
        if(Bot.events.get(info.name.toLowerCase())) {
            console.warn(`Event ${info.name} already exists, overwriting..`)
        }

        Bot.events.set(info.name.toLowerCase(), {
            ...info,
            run: loaded.runCommand
        });
    }
}

export function Command(info: Command): ClassDecorator {
    return function(Command: any) {
        const loaded = new Command();
        if(Bot.commands.get(info.name.toLowerCase())) {
            console.warn(`Command ${info.name} already exists, overwriting..`)
        }

        Bot.commands.set(info.name.toLowerCase(), {
            ...info,
            run: loaded.runCommand,
            hasPermission: loaded.hasPermission
        })
    }
}
