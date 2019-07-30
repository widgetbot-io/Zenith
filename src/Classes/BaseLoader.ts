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
}
