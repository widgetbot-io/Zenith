import {Event} from "..";
import {Message} from "discord.js";
import {BaseEvent} from "../interfaces/command";

@Event({
	name: 'Ran commands removing',
	eventName: 'messageDelete',
	description: 'Message Delete Event'
})
export default class extends BaseEvent<{}> {
	async runEvent(message: Message): Promise<void> {
		if (this.bot.commandHandler.ranCommands[message.id]) delete this.bot.commandHandler.ranCommands[message.id];
	}
}
