export interface BaseArgumentOptions {
	name: string,
	description: string,
	type?: ArgumentType
}

export interface MainArgumentOptions extends BaseArgumentOptions {}

export interface FlagArgumentOptions extends BaseArgumentOptions {
	short?: string
}

export enum ArgumentType {
	BOOLEAN,
	NUMBER,
	STRING,
	GUILD_MEMBER,
	TEXT_CHANNEL,
	VOICE_CHANNEL,
	GUILD_ROLE,
	TEXT_EMOJI
}
