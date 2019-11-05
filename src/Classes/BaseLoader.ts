import {sync} from 'glob';
import {Logger} from "./Logger";

export class BaseLoader {
	protected logger: Logger = new Logger('Loader', this.name);

	constructor(protected name: string) { }

	getLoadable(directory: string): string[] {
		let files: string[] = sync(directory);
		files = files.filter(a => !a.endsWith('.d.ts') || !a.endsWith('.map'));

		return files;
	}

	async  loadAll(dir: string = this.name) {
		const files: string[] = this.getLoadable(`${__dirname}/../${dir}/**/*.**`);

		this.logger.info('Loading...');
		for (const file of files) {
			if (file.endsWith('.d.ts')) continue;
			if (file.endsWith('.map')) continue;

			await require(file);
		}

		this.logger.info(`${files.length} loaded`)
	}
}
