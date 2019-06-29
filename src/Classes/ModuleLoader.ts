import {Client} from "../Client";
import * as _cliProgress from 'cli-progress';
import {sync} from 'glob';

export class ModuleLoader {
    constructor(private Client: Client) { }
    getLoadableModules(): string[] {
        let files: string[] = sync(`${__dirname}/../Modules/*.**`);
        files = files.filter(a => !a.endsWith('.d.ts') || !a.endsWith('.map'));

        return files;
    }

    async loadModules(): Promise<void> {
        let start: number = 0;
        const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
        const modules: string[] = await this.getLoadableModules();

        console.log('Loading Modules...');
        progressBar.start(modules.length, start);
        for (const module of modules) {
            start += 1;
            await progressBar.update(start);
            await require(module);
        }

        await progressBar.stop();
    }

    async loadCustomModules(): Promise<void> {}
}
