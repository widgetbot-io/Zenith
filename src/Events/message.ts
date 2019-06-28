import { Event } from "../services/decorators";
import {Client} from "../Client";
import {Message} from "discord.js";

@Event({
	name: 'message',
	description: 'haha'
})
export default class {
	async runCommand(client: Client, message: Message): Promise<void> {
		console.log(message.cleanContent);
		await client.commandHandler.handleMessage(message)
	}
}
