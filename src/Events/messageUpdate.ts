import {Event} from "..";
import {Message} from "discord.js";
import {BaseEvent} from "../interfaces/command";

@Event({
	name: 'Message Update handler',
	eventName: 'messageUpdate',
	description: 'Message Update Event'
})
export default class extends BaseEvent<{}, 'messageUpdate'> {
	async runEvent(oldMessage: Message, newMessage: Message): Promise<void> {
		if (oldMessage === newMessage) return;

		await this.bot.commandHandler.handleMessage(newMessage)
	}
}
