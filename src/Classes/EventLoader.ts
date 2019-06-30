import {Client} from '../Client';
import * as _cliProgress from 'cli-progress';
import {sync} from 'glob';
import {BaseLoader} from ".";

export class EventLoader extends BaseLoader {
    constructor(private client: Client) { super() }

    async loadEvents(): Promise<void> {
        let start: number = 0;
        const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
        const events: string[] = await this.getLoadable(`${__dirname}/../Events/**/*.**`);

        console.log('Loading Events...');
        progressBar.start(events.length, start);
        for (const event of events) {
            start += 1;
            await progressBar.update(start);
            await require(event);
        }

        await progressBar.stop();
    }

    async loadCustomEvents(): Promise<void> {
        let events: string[][] = [];

        // TODO: Progress bar
        for (const eventDir of this.client.settings.dirs.events) {
            events.push(await this.getLoadable(eventDir))
        }

        for (const event of events) {
            for (const e of event) {
                require(e);
            }
        }

        console.log('Loaded custom Commands \n');
    }

    async digestEvents() {
        for (const event of Client.events) {
            this.client.digestEvent(event[1].eventName, async (...args) => {
                // @ts-ignore
                await event[1].run(...args);
            })
        }
    }
}
