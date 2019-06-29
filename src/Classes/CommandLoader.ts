import {Client} from '../Client';
import * as _cliProgress from 'cli-progress';
import {sync} from 'glob';

export class CommandLoader {
    constructor(private Client: Client) { }
    getLoadableCommands(directory: string = `${__dirname}/../Commands/**/*.**`): string[] {
        let files: string[] = sync(directory);
        files = files.filter(a => !a.endsWith('.d.ts') || !a.endsWith('.map'));

        return files;
    }

    async loadCommands(): Promise<void> {
        let start: number = 0;
        const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
        const commands: string[] = await this.getLoadableCommands();

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
        for (const commandDir of this.Client.settings.dirs.commands) {
            commands.push(await this.getLoadableCommands(commandDir))
        }

        for (const command of commands) {
            for (const c of command) {
                require(c);
            }
        }

        console.log('Loaded custom Commands');
    }
}
