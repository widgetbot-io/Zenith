import {Message} from "discord.js";
import {Client} from "../Client";
import {Module} from "../services/decorators";

export class CommandHelper {
    constructor(public message: Message, public client: Client, public module: Module, public argHelper: any) {}
}