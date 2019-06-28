import {Client} from '../Client';
import * as _cliProgress from 'cli-progress';
import {BaseCommand} from './Command';
import {sync} from 'glob';

export class CommandLoader {
    constructor(private Client: Client) {

    }

    getLoadableCommands(): string[] {
        let files: string[] = sync(`${__dirname}/../Commands/**/*.**`);
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
}
