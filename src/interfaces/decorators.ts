import {CommandHelper} from "../Classes/CommandHelper";
import {Message} from "discord.js";
import {BaseArgument} from "../Classes";
import {Bot} from "../Bot";

export interface Base {
	name: string,
	description: string
}
export interface IModule extends Base {
	module?: any
}
export interface ICommand extends Base {
	aliases?: string[],
	arguments?: BaseArgument[]
	module: string,
	run?: (helper: CommandHelper<any, any>) => Promise<void>;
	hasPermission?: (message: Message, bot: Bot) => Promise<boolean>;
}
export interface IEvent extends Base {
	eventName: string,
	run?: (...args: any[]) => Promise<void>;
}
