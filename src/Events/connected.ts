import { Event } from "../services/decorators";
import {Client} from "../Client";

@Event({
	name: 'Connected',
	eventName: 'ready',
	description: 'haha'
})
export default class {
	async runCommand(client: Client): Promise<void> {
		console.log('Bro der guys ready!')
	}
}
