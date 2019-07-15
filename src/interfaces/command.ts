import {CommandHelper} from "../Classes";
import {Message} from "discord.js";
import {Bot} from "../Bot";

export abstract class BaseCommand {
	public bot!: Bot;
	abstract runCommand(helper: CommandHelper): Promise<void>;
	abstract hasPermission(message: Message): Promise<boolean>;
}

export abstract class BaseEvent {
	abstract runEvent(...args: any): Promise<void>;
}
