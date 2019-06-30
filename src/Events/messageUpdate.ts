import { Event } from "../services/decorators";
import {Bot} from "../Bot";
import {Message} from "discord.js";

@Event({
	name: 'Message Update handler',
	eventName: 'messageUpdate',
	description: 'Message Update Event'
})
export default class {
	async runCommand(oldMessage: Message, newMessage: Message): Promise<void> {
		if (oldMessage === newMessage) return;

		await (newMessage.client as Bot).commandHandler.handleMessage(newMessage)
	}
}
