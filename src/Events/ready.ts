import { Event } from "..";
import {Bot} from "../Bot";
import {Logger} from "../Classes";
import {BaseEvent} from "../interfaces/command";

@Event({
	name: 'Connection Ready',
	eventName: 'ready',
	description: 'haha'
})
export default class extends BaseEvent {
	async runEvent(client: Bot): Promise<void> {
		Logger.Info(`Event`, 'Ready event is fired.')
	}
}
