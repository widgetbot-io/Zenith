import { Event } from "../services/decorators";
import {Client} from "../Client";
import {Message} from "discord.js";

@Event({
	name: 'messageUpdate',
	description: 'Message Update Event'
})
export default class {
	async runCommand(client: Client, oldMessage: Message, newMessage: Message): Promise<void> {
		if (oldMessage === newMessage) return;

		await client.commandHandler.handleMessage(newMessage)
	}
}
