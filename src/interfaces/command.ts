import {CommandHelper} from "../Classes/CommandHelper";
import {Message} from "discord.js";

export interface BaseCommand {
	runCommand(helper: CommandHelper): Promise<void>;
	hasPermission(message: Message): Promise<boolean>
}

export interface BaseEvent {
	runEvent(...args): Promise<void>;
}
