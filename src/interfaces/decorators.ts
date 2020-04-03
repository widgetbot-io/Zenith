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
	run?: (helper: CommandHelper) => Promise<void>,
	hasPermission?: (message: Message, bot: Bot) => Promise<boolean>,
	discordPermissions?: string[]
}
export interface IEvent extends Base {
	eventName: keyof ClientEvents,
	run?: (...args: any[]) => Promise<void>
}
