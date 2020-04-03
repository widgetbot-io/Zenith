import { Event } from "..";
import {Logger} from "../Classes";
import {BaseEvent} from "../interfaces/command";

@Event({
	name: 'Shard Ready.',
	eventName: 'shardReady',
	description: 'Emitted when a shard turns ready.'
})
export default class extends BaseEvent<{}, 'shardReady'> {
	async runEvent(shard: number): Promise<void> {
		Logger.Warn('Discord[Events]', `Shard ${shard} is ready.`)
	}
}
