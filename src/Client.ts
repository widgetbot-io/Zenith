import {Client as Bot, ClientOptions, Collection, Message} from 'discord.js';
import {CommandLoader} from "./Classes";
import {ModuleLoader} from "./Classes/ModuleLoader";
import {Command, Module} from "./services/decorators";
import {CommandHandler} from "./Classes/CommandHandler";

interface Options {
    token: string,
    prefix: string,
    clientOptions: ClientOptions,
    roots: string[],
}

export class Client extends Bot {
    private commandHandler: CommandHandler = new CommandHandler(this);

    private commandLoader: CommandLoader;
    private moduleLoader: ModuleLoader;

    public static commands: Collection<string, Command> = new Collection();
    public static modules: Collection<string, Module> = new Collection();

    constructor(private settings: Options) {
        super(settings.clientOptions);
        // TODO: Framework settings
        // TODO: Allow for custom logger/config

        this.on('message', m => this.onMessage(m));

        this.moduleLoader = new ModuleLoader(this);
        this.moduleLoader.loadModules();
        // TODO: Framework Module loading

        this.commandLoader = new CommandLoader(this);
        this.commandLoader.loadCommands();
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
        await this.login(this.settings.token).then(() => {
            console.log('Bot ready!')
        }).catch((err) => {
            console.log(err)
        });
    }

    async onMessage(message: Message): Promise<void> {
        await this.commandHandler.handleMessage(message);
    }
}