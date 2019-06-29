import { Event } from "../services/decorators";
import {Client} from "../Client";

@Event({
	name: 'Connection Ready',
	eventName: 'ready',
	description: 'haha'
})
export default class {
	async runCommand(client: Client): Promise<void> {
		console.log('Ready event is fired.')
	}
}
