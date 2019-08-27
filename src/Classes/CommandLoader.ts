import {Bot} from '../Bot';
import {BaseLoader} from "./BaseLoader";

export class CommandLoader extends BaseLoader {
    constructor(private bot: Bot<{}>) { super('Command') }

    async loadCommands(): Promise<void> {
        const commands: string[] = await this.getLoadable(`${__dirname}/../Commands/**/*.**`);

        this.logger.info('Loading Commands...');
        for (const command of commands) {
            if (command.endsWith('.d.ts')) continue;
            if (command.endsWith('.map')) continue;

            await require(command);
        }

        this.logger.info(`${commands.length} Commands loaded`)
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
