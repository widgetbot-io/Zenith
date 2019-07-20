import { Event } from "..";
import {Bot} from "../Bot";
import {Message} from "discord.js";
import {BaseEvent} from "../interfaces/command";

@Event({
	name: 'Message Handler',
	eventName: 'message',
	description: 'haha'
})
export default class extends BaseEvent {
	async runEvent(message: Message): Promise<void> {
		await (message.client as Bot).commandHandler.handleMessage(message)
	}
}
