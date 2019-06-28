import {Client} from '../Client';
import * as _cliProgress from 'cli-progress';
import {sync} from 'glob';

export class EventLoader {
    constructor(private Client: Client) { }
    getLoadableEvents(): string[] {
        let files: string[] = sync(`${__dirname}/../Events/**/*.**`);
        files = files.filter(a => !a.endsWith('.d.ts') || !a.endsWith('.map'));

        return files;
    }

    async loadEvents(): Promise<void> {
        let start: number = 0;
        const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
        const events: string[] = await this.getLoadableEvents();

        console.log('Loading Events...');
        progressBar.start(events.length, start);
        for (const event of events) {
            start += 1;
            await progressBar.update(start);
            await require(event);
        }

        await progressBar.stop();
    }

    async digestEvents() {
        for (const event of Client.events) {
            this.Client.digestEvent(event[0], async (client, ...args) => {
                await event[1].run(client, args);
            })
        }
    }
}
