import {ClientOptions} from "discord.js";
import {LimitSettings} from "./ratelimit";

export interface Options {
	token: string,
	prefix: string,
	dirs: DirectoryOptions,
	clientOptions: ClientOptions,
	roots: string[],
	limits: LimitSettings
}

export interface DirectoryOptions {
	commands: string[],
	events: string[],
	modules: string[]
}
