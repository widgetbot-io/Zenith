import { Event } from "../services/decorators";
import {Bot} from "../Bot";
import {Message} from "discord.js";

@Event({
	name: 'Message Handler',
	eventName: 'message',
	description: 'haha'
})
export default class {
	async runCommand(message: Message): Promise<void> {
		await (message.client as Bot).commandHandler.handleMessage(message)
	}
}
