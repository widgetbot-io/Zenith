import 'reflect-metadata';

import {Client, Collection} from 'discord.js';
import {CommandLoader, Logger} from "./Classes";
import { ModuleLoader } from "./Classes/ModuleLoader";
import { CommandHandler } from "./Classes/CommandHandler";
import { Options, ICommand, IModule, IEvent } from "./interfaces";
import {EventLoader} from "./Classes/EventLoader";

export class Bot extends Client {
    private logger: Logger = new Logger(`Bot`);

    public static commands: Collection<string, ICommand> = new Collection();
    public static modules: Collection<string, IModule> = new Collection();
    public static events: Collection<string, IEvent> = new Collection();


    public commandHandler: CommandHandler = new CommandHandler(this);
    public commandLoader: CommandLoader = new CommandLoader(this);
    public moduleLoader: ModuleLoader = new ModuleLoader(this);
    public eventLoader: EventLoader = new EventLoader(this);

    private events: {[key: string]: Function[]} = {};
    constructor(public settings: Options, public client: any) {
        super(settings.clientOptions);

        this.logger.info(`Hello World!`)

        // TODO: Allow for custom logger/config
    }

    public digestEvent(event: string, cb: (...args: any[]) => void ): void {
        if (!(this.events[event] && this.events[event].length)) {
            this.events[event] = [cb];

            this.on(event, (...args: any[]) => {
                try {
                    for (const callback of this.events[event]) {
                        callback(...args)
                    }
                } catch (e) {
                    this.logger.error(e);
                }
            })
        } else {
            this.events[event].push(cb);
        }
    }

    async setup(): Promise<this> {
        try {
            await this.moduleLoader.loadModules();
            await this.moduleLoader.loadCustomModules();
            await this.eventLoader.loadEvents();
            await this.eventLoader.loadCustomEvents();
            await this.commandLoader.loadCommands();
            await this.commandLoader.loadCustomCommands();
            await this.eventLoader.digestEvents();
        } catch (e) {
            this.logger.error(e);
        }

        return this;
    }

    async connect(): Promise<this> {
        try {
            await this.login(this.settings.token);
        } catch (e) {
            this.logger.error(e);
        }

        return this;
    }
}
