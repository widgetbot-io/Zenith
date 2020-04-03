import {CommandHelper} from "../Classes";
import {ClientEvents, Message} from "discord.js";
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
	arguments?: BaseArgument[],
	hidden?: boolean,
	help?: string,
	module: string,
	run?: (helper: CommandHelper) => any | Promise<any>,
	hasPermission?: (message: Message, bot: Bot) => boolean | Promise<boolean>,
	discordPermissions?: string[]
}
export interface IEvent<K extends keyof ClientEvents> extends Base {
	eventName: K,
	run?: (...args: ClientEvents[K]) => Promise<any>
}
