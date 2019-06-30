import {Client} from '../Client';
import * as _cliProgress from 'cli-progress';
import {sync} from 'glob';
import {BaseLoader} from "./BaseLoader";

export class CommandLoader extends BaseLoader {
    constructor(private client: Client) { super() }

    async loadCommands(): Promise<void> {
        let start: number = 0;
        const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
        const commands: string[] = await this.getLoadable(`${__dirname}/../Commands/**/*.**`);

        console.log('Loading Commands...');
        progressBar.start(commands.length, start);
        for (const command of commands) {
            start += 1;
            await progressBar.update(start);
            await require(command);
        }

        await progressBar.stop();
    }

    async loadCustomCommands(): Promise<void> {
        let commands: string[][] = [];

        // TODO: Progress bar
        for (const commandDir of this.client.settings.dirs.commands) {
            commands.push(await this.getLoadable(commandDir))
        }

        for (const command of commands) {
            for (const c of command) {
                require(c);
            }
        }

        console.log('Loaded custom Commands \n');
    }
}
