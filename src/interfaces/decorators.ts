import {CommandHelper} from "../Classes/CommandHelper";
import {Message} from "discord.js";

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
	run?: (...args) => Promise<void>;
}
