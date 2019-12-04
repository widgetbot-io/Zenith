import {CommandHelper} from "../Classes";
import {Message} from "discord.js";
import {Bot} from "../Bot";

export abstract class BaseCommand {
	abstract runCommand(helper: CommandHelper<any, any>): Promise<void>;
	abstract hasPermission(message: Message, bot: Bot): Promise<boolean>;
}

export abstract class BaseEvent<C = any> {
	public bot!: Bot<C>;
	abstract runEvent(...args: any): Promise<void>;
}

export interface Parsed {
	command: string,
	stringy: string,
	args: string[]
}
