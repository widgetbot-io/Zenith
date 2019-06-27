import {Client} from "../Client";
import {BaseCommand} from "./Command";
import {sync} from 'glob';

export class ModuleLoader {
    constructor(private Client: Client) {

    }

    getLoadableModules(): string[] {
        let files: string[] = sync(`${__dirname}/../Modules/*.**`);
        files = files.filter(a => !a.endsWith('.d.ts') || !a.endsWith('.map'));

        return files;
    }

    async loadModules(): Promise<void> {
        const modules: string[] = this.getLoadableModules();

        for (const module of modules) require(module);
    }
}
