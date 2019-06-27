import {Client} from "../Client";
import {BaseCommand} from "./Command";
import {sync} from 'glob';

export class CommandLoader {
    constructor(private Client: Client) {

    }

    getLoadableCommands(): string[] {
        let files: string[] = sync(`${__dirname}/../Commands/**/*.**`);
        files = files.filter(a => !a.endsWith('.d.ts') || !a.endsWith('.map'));

        return files;
    }

    async loadCommands(): Promise<boolean> {
        const commands: string[] = this.getLoadableCommands();

        for (const command of commands) require(command);
        return true;
    }
}
