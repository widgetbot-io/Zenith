import { Bot } from '../Bot';
import {ICommand, IModule, IEvent, BaseEvent, BaseCommand} from '../interfaces';

export function Module(info: IModule): ClassDecorator {
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

export function Event(info: IEvent): ClassDecorator {
    return function(Event: any) {
        const loaded: BaseEvent = new Event();
        if(Bot.events.get(info.name.toLowerCase())) {
            console.warn(`Event ${info.name} already exists, overwriting..`)
        }

        Bot.events.set(info.name.toLowerCase(), {
            ...info,
            run: loaded.runEvent
        });
    }
}

export function Command(info: ICommand): ClassDecorator {
    return function(Command: any) {
        const loaded: BaseCommand = new Command();
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
