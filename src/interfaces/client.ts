import {ClientOptions} from "discord.js";

export interface Options {
	token: string,
	prefix: string,
	clientOptions: ClientOptions,
	roots: string[],
}
