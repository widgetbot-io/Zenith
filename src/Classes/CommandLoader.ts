import {Bot} from '../Bot';
import {BaseLoader} from "./BaseLoader";
import {ICommand} from "../interfaces";

export class CommandLoader extends BaseLoader {
    constructor(private bot: Bot) { super('Commands') }

    static async get(cmd: string): Promise<ICommand | undefined> {
        return Bot.commands.find((value) => {
            if (value.name.toLowerCase() === cmd) {
                return true;
            } else {
                if (value.aliases) for (const alias of value.aliases) if(alias.toLowerCase() === cmd) return true;
            }

            return false;
        });
    }

    async loadCustomCommands(): Promise<void> {
        let count: number = 0;
        let commands: string[][] = [];

        // TODO: Progress bar
        for (const commandDir of this.bot.settings.dirs.commands) {
            commands.push(await this.getLoadable(commandDir))
        }

        for (const command of commands) {
            for (const c of command) {
                if (c.endsWith('.d.ts')) continue;
                if (c.endsWith('.map')) continue;
                count += 1;
                require(c);
            }
        }

        if (count === 0) {
            console.log();
            return;
        }
        this.logger.info(`Loaded ${count} custom Commands \n`);
    }
}
