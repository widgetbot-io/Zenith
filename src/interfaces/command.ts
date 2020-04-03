import {CommandHelper} from "../Classes";
import {ClientEvents, Message} from "discord.js";
import {Bot} from "../Bot";
import {ICommand} from "./decorators";

export abstract class BaseCommand {
	abstract runCommand(helper: CommandHelper): Promise<any>;
	abstract hasPermission(message: Message, bot: Bot): Promise<boolean>;
}

export abstract class BaseEvent<C = any, K extends keyof ClientEvents = keyof ClientEvents> {
	public bot!: Bot<C>;
	abstract runEvent(...args: ClientEvents[K]): any | Promise<any>;
}

export interface Parsed {
	command: ICommand,
	stringy: string,
	args: string[]
}
