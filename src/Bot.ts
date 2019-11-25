import 'reflect-metadata';

import {Client, Collection} from 'discord.js';
import {CommandHandler, CommandLoader, EventLoader, Logger, ModuleLoader} from "./Classes";
import {ICommand, IEvent, IModule, Options} from "./interfaces";

export class Bot<C = any> extends Client {
    private logger: Logger = new Logger('Bot');

    public static commands: Collection<string, ICommand> = new Collection();
    public static modules: Collection<string, IModule> = new Collection();
    public static events: Collection<string, IEvent> = new Collection();


    public commandHandler: CommandHandler = new CommandHandler(this);
    public commandLoader: CommandLoader = new CommandLoader(this);
    public moduleLoader: ModuleLoader = new ModuleLoader(this);
    public eventLoader: EventLoader = new EventLoader(this);

    private events: {[key: string]: Function[]} = {};
    constructor(public settings: Options, public client: C) {
        super(settings.clientOptions);

        this.logger.info('Hello World')

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
            await this.moduleLoader.loadAll();
            await this.moduleLoader.loadCustomModules();
            await this.eventLoader.loadAll();
            await this.eventLoader.loadCustomEvents();
            await this.commandLoader.loadAll();
            await this.commandLoader.loadCustomCommands();
            await this.eventLoader.digestEvents();
        } catch (e) {
            this.logger.fatal(e);
        }

        return this;
    }

    async connect(): Promise<this> {
        try {
            await super.login(this.settings.token);
        } catch (e) {
            this.logger.fatal(e);
        }

        return this;
    }
}
