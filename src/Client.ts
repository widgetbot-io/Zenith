import {Client as Bot, Collection, Message} from 'discord.js';
import {CommandLoader} from "./Classes";
import {ModuleLoader} from "./Classes/ModuleLoader";
import {CommandHandler} from "./Classes/CommandHandler";
import {Options, Command as ICommand, Module as IModule} from "./interfaces";

export class Client extends Bot {
    private commandHandler: CommandHandler = new CommandHandler(this);

    private commandLoader: CommandLoader;
    private moduleLoader: ModuleLoader;

    public static commands: Collection<string, ICommand> = new Collection();
    public static modules: Collection<string, IModule> = new Collection();

    constructor(private settings: Options) {
        super(settings.clientOptions);
        // TODO: Framework settings
        // TODO: Allow for custom logger/config

        this.on('message', m => this.onMessage(m));

        this.moduleLoader = new ModuleLoader(this);
        // TODO: Framework Module loading

        this.commandLoader = new CommandLoader(this);
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

    async onMessage(message: Message): Promise<void> {
        await this.commandHandler.handleMessage(message);
    }
}
