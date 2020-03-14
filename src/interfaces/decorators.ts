import {CommandHelper} from "../Classes";
import {Message} from "discord.js";
import {BaseArgument} from "../Classes";
import {Bot} from "../Bot";
import {BaseModule} from "../services/modules";

export interface Base {
	name: string,
	description: string
}
export interface IModule extends Base {
	module?: BaseModule
}
export interface ICommand extends Base {
	aliases?: string[],
	arguments?: BaseArgument[]
	module: string,
	run?: (helper: CommandHelper<any, any>) => Promise<void>;
	hasPermission?: (message: Message, bot: Bot) => Promise<boolean>;
	allowQuotes?: boolean;
}
export interface IEvent extends Base {
	eventName: string,
	run?: (...args: any[]) => Promise<void>;
}
