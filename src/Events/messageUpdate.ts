import { Event } from "..";
import {Bot} from "../Bot";
import {Message} from "discord.js";
import {BaseEvent} from "../interfaces/command";

@Event({
	name: 'Message Update handler',
	eventName: 'messageUpdate',
	description: 'Message Update Event'
})
export default class extends BaseEvent {
	async runEvent(oldMessage: Message, newMessage: Message): Promise<void> {
		if (oldMessage === newMessage) return;

		await (newMessage.client as Bot).commandHandler.handleMessage(newMessage)
	}
}
