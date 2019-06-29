import {ClientOptions} from "discord.js";

export interface Options {
	token: string,
	prefix: string,
	dirs: DirectoryOptions,
	clientOptions: ClientOptions,
	roots: string[]
}

export interface DirectoryOptions {
	commands: string[],
	events: string[],
	modules: string[]
}
