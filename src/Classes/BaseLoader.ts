// @ts-ignore
import {sync} from 'glob';

export class BaseLoader {
	getLoadable(directory: string): string[] {
		let files: string[] = sync(directory);
		files = files.filter(a => !a.endsWith('.d.ts') || !a.endsWith('.map'));

		return files;
	}
}
