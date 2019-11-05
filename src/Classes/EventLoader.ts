import {Bot} from '../Bot';
import {BaseLoader} from "./BaseLoader";

export class EventLoader extends BaseLoader {
    constructor(private bot: Bot) { super('Events') }

    async loadCustomEvents(): Promise<void> {
        let count: number = 0;
        let events: string[][] = [];

        // TODO: Progress bar
        for (const eventDir of this.bot.settings.dirs.events) {
            events.push(await this.getLoadable(eventDir))
        }

        for (const event of events) {
            for (const e of event) {
                if (e.endsWith('.d.ts')) continue;
                if (e.endsWith('.map')) continue;
                count += 1;
                require(e);
            }
        }

        if (count === 0) {
            console.log();
            return;
        }
        this.logger.info(`Loaded ${count} custom Events \n`);
    }

    async digestEvents() {
        for (const event of Bot.events) {
            this.bot.digestEvent(event[1].eventName, async (...args) => {
                // @ts-ignore
                await event[1].run.call({ bot: this.bot }, ...args);
            })
        }
    }
}
