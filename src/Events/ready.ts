import { Event } from "../services/decorators";
import {Bot} from "../Bot";

@Event({
	name: 'Connection Ready',
	eventName: 'ready',
	description: 'haha'
})
export default class {
	async runCommand(client: Bot): Promise<void> {
		console.log('Ready event is fired.')
	}
}
