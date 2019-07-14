// @ts-ignore
import {sync} from 'glob';
import {Logger} from "./Logger";

export class BaseLoader {
	protected logger: Logger;
	constructor(name: string) {
		this.logger = new Logger('Loader', name);
	}


	getLoadable(directory: string): string[] {
		let files: string[] = sync(directory);
		files = files.filter(a => !a.endsWith('.d.ts') || !a.endsWith('.map'));

		return files;
	}
}
