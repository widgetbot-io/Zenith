import { Event } from "../services/decorators";
import {Bot} from "../Bot";
import {Logger} from "../Classes";

@Event({
	name: 'Connection Ready',
	eventName: 'ready',
	description: 'haha'
})
export default class {
	async runCommand(client: Bot): Promise<void> {
		Logger.Info(`Event`, 'Ready event is fired.')
	}
}
