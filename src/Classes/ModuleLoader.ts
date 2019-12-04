import {Bot} from "../Bot";
import {BaseLoader} from "./BaseLoader";

export class ModuleLoader extends BaseLoader {
    constructor(private bot: Bot) { super('Modules') }

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
        this.logger.info(`Loaded ${count} custom Modules \n`);
    }
}
