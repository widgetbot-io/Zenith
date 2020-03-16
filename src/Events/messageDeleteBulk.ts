import {Event} from "..";
import {Collection, Message, Snowflake} from "discord.js";
import {BaseEvent} from "../interfaces/command";

@Event({
	name: 'Ran commands removing but bulk',
	eventName: 'messageDeleteBulk',
	description: 'Message Delete Bulk Event'
})
export default class extends BaseEvent<{}> {
	async runEvent(messages:  Collection<Snowflake, Message>): Promise<void> {
		for (const id of messages.keyArray()) {
			if (this.bot.commandHandler.ranCommands[id])
				delete this.bot.commandHandler.ranCommands[id];
		}
	}
}
