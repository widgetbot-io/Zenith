import {CommandHelper} from "../Classes";
import {Message} from "discord.js";
import {Bot} from "../Bot";
import {ICommand} from "./decorators";

export abstract class BaseCommand {
	abstract runCommand(helper: CommandHelper<any, any>): Promise<void>;
	abstract hasPermission(message: Message, bot: Bot): Promise<boolean>;
}

export abstract class BaseEvent<C = any> {
	public bot!: Bot<C>;
	abstract runEvent(...args: any): Promise<void>;
}

export interface Parsed {
	command: ICommand,
	stringy: string,
	args: string[]
}
