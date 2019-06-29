import {CommandHelper} from "../Classes/CommandHelper";
import {Message} from "discord.js";
import {Client} from "../Client";

export interface Base {
	name: string,
	description: string
}
export interface Module extends Base {
	module?: any
}
export interface Command extends Base {
	module: string,
	run?: (helper: CommandHelper) => Promise<void>;
	hasPermission?: (message: Message) => Promise<boolean>;
}
export interface Event extends Base {
	eventName: string,
	run?: (...args) => Promise<void>;
}
