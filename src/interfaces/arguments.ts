export interface BaseArgumentOptions {
	name: string,
	short?: string,
	optional?: boolean,
	type?: ArgumentType,
	repeating?: boolean
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
