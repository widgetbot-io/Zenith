import {Client as Bot, Collection} from 'discord.js';
import {CommandLoader} from "./Classes";
import {ModuleLoader} from "./Classes/ModuleLoader";
import {CommandHandler} from "./Classes/CommandHandler";
import { Options, Command as ICommand, Module as IModule } from "./interfaces";

export class Client extends Bot {
    public static commands: Collection<string, ICommand> = new Collection();
    public static modules: Collection<string, IModule> = new Collection();

    public commandHandler: CommandHandler = new CommandHandler(this);
    public commandLoader: CommandLoader = new CommandLoader(this);
    public moduleLoader: ModuleLoader = new ModuleLoader(this);

    constructor(private settings: Options) {
        super(settings.clientOptions);

        // TODO: Framework settings
        // TODO: Allow for custom logger/config

        this.on('message', m =>this.commandHandler.handleMessage(m));
        this.on('messageUpdate', (o, n) => this.commandHandler.handleMessage(n));

        // TODO: Framework Module loading
        // TODO: Framework Command loading

        // TODO: Event loader & handler
        // use this.digestEvent

        this.start();
    }

    digestEvent(event: string, cb: (...args) => void ): void {
        this.on(event, (...args) => {
            // TODO Promises w/ catch
            try {
                cb(...args);
            } catch (e) {
                console.error(e);
            }
        })
    }

    async start(): Promise<void> {
        this.moduleLoader.loadModules().then(() => {
            this.commandLoader.loadCommands().then(() => {
                this.login(this.settings.token).then(() => {
                    console.log('Bot ready!')
                }).catch((err) => {
                    console.log(err)
                });
            }).catch(e => { console.error(e) });
        }).catch(e => { console.error(e) })
    }
}
