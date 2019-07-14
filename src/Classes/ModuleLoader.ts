import {Bot} from "../Bot";
import {BaseLoader} from ".";

export class ModuleLoader extends BaseLoader {
    constructor(private bot: Bot) { super('Module') }

    async loadModules(): Promise<void> {
        const modules: string[] = await this.getLoadable(`${__dirname}/../Modules/*.**`);

        this.logger.info('Loading Modules...');
        for (const module of modules) {

            if (module.endsWith('.d.ts')) continue;
            if (module.endsWith('.map')) continue;

            await require(module);
        }

        this.logger.info(`${modules.length} Modules loaded`)
    }

    async loadCustomModules(): Promise<void> {
        let count: number = 0;
        let modules: string[][] = [];

        // TODO: Progress bar
        for (const moduleDir of this.bot.settings.dirs.modules) {
            modules.push(await this.getLoadable(moduleDir))
        }

        for (const module of modules) {
            for (const m of module) {
                if (m.endsWith('.d.ts')) continue;
                if (m.endsWith('.map')) continue;
                count += 1;
                require(m);
            }
        }

        if (count === 0) {
            console.log();
            return;
        }
        this.logger.info(`Loaded ${count} custom Modules`);
    }
}
