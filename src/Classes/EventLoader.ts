import {Bot} from '../Bot';
import * as _cliProgress from 'cli-progress';
import {sync} from 'glob';
import {BaseLoader} from ".";

export class EventLoader extends BaseLoader {
    constructor(private bot: Bot) { super() }

    async loadEvents(): Promise<void> {
        let start: number = 0;
        const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
        const events: string[] = await this.getLoadable(`${__dirname}/../Events/**/*.**`);

        console.log('Loading Events...');
        progressBar.start(events.length, start);
        for (const event of events) {
            start += 1;
            await progressBar.update(start);

            if (event.endsWith('.d.ts')) continue;
            if (event.endsWith('.map')) continue;
            await require(event);
        }

        await progressBar.stop();
    }

    async loadCustomEvents(): Promise<void> {
        let events: string[][] = [];

        // TODO: Progress bar
        for (const eventDir of this.bot.settings.dirs.events) {
            events.push(await this.getLoadable(eventDir))
        }

        for (const event of events) {
            for (const e of event) {
                if (e.endsWith('.d.ts')) continue;
                if (e.endsWith('.map')) continue;
                require(e);
            }
        }

        console.log('Loaded custom Commands \n');
    }

    async digestEvents() {
        for (const event of Bot.events) {
            this.bot.digestEvent(event[1].eventName, async (...args) => {
                // @ts-ignore
                await event[1].run(...args);
            })
        }
    }
}
