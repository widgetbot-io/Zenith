import { Event } from "..";
import {Logger} from "../Classes";
import {BaseEvent} from "../interfaces/command";

@Event({
	name: 'Connection Ready',
	eventName: 'ready',
	description: 'haha'
})
export default class extends BaseEvent<{}> {
	async runEvent(): Promise<void> {
		Logger.Warn(`Discord[Events]`, 'Ready event is fired.')
	}
}
