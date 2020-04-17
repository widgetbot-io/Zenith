import {ClientOptions} from "discord.js";
import {LimitSettings} from "./ratelimit";
import {ICommand} from "./decorators";

export interface Options {
	token: string,
	prefix: string,
	dirs: DirectoryOptions,
	clientOptions: ClientOptions,
	roots: string[],
	mentionPrefix?: boolean,
	limits: LimitSettings
}

export interface DirectoryOptions {
	commands: string[],
	events: string[],
	modules: string[]
}
