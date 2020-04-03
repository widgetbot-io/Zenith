import {Event} from "..";
import {Message} from "discord.js";
import {BaseEvent} from "../interfaces/command";

@Event({
	name: 'Message Handler',
	eventName: 'message',
	description: 'haha'
})
export default class extends BaseEvent<{}, 'message'> {
	async runEvent(message: Message): Promise<void> {
		await this.bot.commandHandler.handleMessage(message)
	}
}
