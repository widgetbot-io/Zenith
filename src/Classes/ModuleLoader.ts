import {Bot} from "../Bot";
import * as _cliProgress from 'cli-progress';
import {sync} from 'glob';
import {BaseLoader} from ".";

export class ModuleLoader extends BaseLoader {
    constructor(private bot: Bot) { super() }

    async loadModules(): Promise<void> {
        let start: number = 0;
        const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
        const modules: string[] = await this.getLoadable(`${__dirname}/../Modules/*.**`);

        console.log('Loading Modules...');
        progressBar.start(modules.length, start);
        for (const module of modules) {
            start += 1;
            await progressBar.update(start);

            if (module.endsWith('.d.ts')) continue;
            if (module.endsWith('.map')) continue;

            await require(module);
        }

        await progressBar.stop();
    }

    async loadCustomModules(): Promise<void> {
        let modules: string[][] = [];

        // TODO: Progress bar
        for (const moduleDir of this.bot.settings.dirs.modules) {
            modules.push(await this.getLoadable(moduleDir))
        }

        for (const module of modules) {
            for (const m of module) {
                if (m.endsWith('.d.ts')) continue;
                if (m.endsWith('.map')) continue;

                require(m);
            }
        }

        console.log('Loaded custom modules \n');
    }
}
