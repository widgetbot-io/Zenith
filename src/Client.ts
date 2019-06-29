import 'reflect-metadata';

import { Client as Bot, Collection } from 'discord.js';
import { CommandLoader } from "./Classes";
import { ModuleLoader } from "./Classes/ModuleLoader";
import { CommandHandler } from "./Classes/CommandHandler";
import { Options, Command as ICommand, Module as IModule, Event as IEvent } from "./interfaces";
import {EventLoader} from "./Classes/EventLoader";

export class Client extends Bot {
    private events: {[key: string]: Function[]} = {};

    public static commands: Collection<string, ICommand> = new Collection();
    public static events: Collection<string, IEvent> = new Collection();
    public static modules: Collection<string, IModule> = new Collection();

    public commandHandler: CommandHandler = new CommandHandler(this);
    public commandLoader: CommandLoader = new CommandLoader(this);
    public moduleLoader: ModuleLoader = new ModuleLoader(this);
    public eventLoader: EventLoader = new EventLoader(this);

    constructor(public settings: Options) {
        super(settings.clientOptions);

        // TODO: Allow for custom logger/config

        this.on('messageUpdate', (o, n) => this.commandHandler.handleMessage(n));

        this.start();
    }

    public digestEvent(event: string, cb: (...args) => void ): void {
        if (!(this.events[event] && this.events[event].length)) {
            this.events[event] = [cb];

            this.on(event, (...args) => {
                try {
                    for (const callback of this.events[event]) {
                        callback(...args)
                    }
                } catch (e) {
                    console.error(e);
                }
            })
        } else {
            this.events[event].push(cb);
        }
    }

    async start(): Promise<void> {
        this.moduleLoader.loadModules().then(() => {
            this.moduleLoader.loadCustomModules().then(() => {
                this.eventLoader.loadEvents().then(() => {
                    this.eventLoader.loadCustomEvents().then(() => {
                        this.commandLoader.loadCommands().then(() => {
                            this.commandLoader.loadCustomCommands().then(() => {
                                this.eventLoader.digestEvents().then(() => {
                                    this.login(this.settings.token).catch(e => { console.error(e) });
                                }).catch(e => { console.error(e) });
                            }).catch(e => { console.error(e) });
                        }).catch(e => { console.error(e) });
                    }).catch(e => { console.error(e) });
                }).catch(e => { console.error(e) });
            }).catch(e => { console.error(e) });
        }).catch(e => { console.error(e) })
    }
}
