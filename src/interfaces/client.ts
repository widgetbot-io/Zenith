import {ClientOptions} from "discord.js";
import {IConfig, ILogger, IStaticLogger} from "./external";

export interface Options {
	token: string,
	prefix: string,
	clientOptions: ClientOptions,
	roots: string[],
	logger: ILogger | IStaticLogger,
	config: IConfig
}
