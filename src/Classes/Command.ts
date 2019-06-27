import {Message} from "discord.js";
import {CommandHelper} from "./CommandHelper";

export interface BaseCommand {
    runCommand(helper: CommandHelper): Promise<void>;
    hasPermission(message: Message): Promise<boolean>
}