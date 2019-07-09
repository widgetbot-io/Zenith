import {ClientOptions} from "discord.js";
import {IRedis} from ".";

export interface Options {
	token: string,
	prefix: string,
	dirs: DirectoryOptions,
	clientOptions: ClientOptions,
	roots: string[]
	driver?: IRedis
}

export interface DirectoryOptions {
	commands: string[],
	events: string[],
	modules: string[]
}
