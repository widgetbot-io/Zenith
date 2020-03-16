import {BaseArgument, FlagArgument, FlagArgumentWithValue, RequiredArgument} from './Bases';
import {ArgumentType, ICommand, Parsed} from '../interfaces';
import {GuildChannel, Message} from "discord.js";

const userMention = /<@!?(\d{17,})>/;
const roleMention = /<@&(\d{17,})>/;
const emojiPattern = /^(?:<a?:\w{2,32}:)?(\d{17,})>?$/;

export class ArgumentHelper {
	private readonly args: BaseArgument[];
	public notFlags: any[];
	public flags: any[];
	public flagValues: { arg: BaseArgument, val: string}[] = [];
	constructor(public command: ICommand, public parsed: Parsed, public content: string, private message: Message) {
		this.args = this.command.arguments || [];
		this.flags = this.parsed.args.filter(arg => this.isFlag(arg));
		this.notFlags = this.parsed.args.filter(arg => !this.flags.find(a => a === arg));
	}

	async argString(): Promise<string> {
		return this.notFlags.join(" ");
	}

	private static GetFor(ic: string, usage: string): string | undefined {
		if(!usage.startsWith(`<${ic}`) || !usage.endsWith('>')) return; // Ensures it's the proper format.
		return usage.substr(ic.length + 1, usage.length - ic.length - 2); // Returns just the ID.
	}

	private async parse(arg: BaseArgument, val: string[]): Promise<any[]> {
		if (!val.filter(a=>!!a).length) return [];
		const args = [];
		switch (arg.type) {
			case ArgumentType.BOOLEAN: {
				for (const v of val) {
					if (Boolean(v)) args.push(Boolean(v));
				}
				break;
			}
			case ArgumentType.NUMBER: {
				for (const v of val) {
					if (!isNaN(Number(val))) args.push(Number(v));
				}
				break;
			}
			case ArgumentType.GUILD_MEMBER: {
				if (this.message.channel.type !== "text") throw new Error(`Attempt to use ArgumentType.GUILD_MEMBER outside of a guild.`);
				const { members } = this.message.guild!;
				for (const v of val) {
					const match = userMention.exec(v);
					const m = members.cache.find(x => x.id === (match ? match[1] : v) || x.displayName === v);
					if (m) args.push(m);
				}
				break;
			}
			case ArgumentType.TEXT_CHANNEL: {
				// TODO: Localization
				if (this.message.channel.type !== 'text') throw new Error(`Attempt to use ArgumentType.TEXT_CHANNEL outside of a guild.`);
				const channels = this.message.guild!.channels.cache.filter(c => c.type === 'text');
				for (let v of val) {
					if (ArgumentHelper.GetFor('#', v)) v = <string> ArgumentHelper.GetFor('#', v);
					const channel = channels.find(c => c.id === v || c.name === v);
					if (channel) args.push(channel);
				}
				return args;
			}
			case ArgumentType.VOICE_CHANNEL: {
				if (this.message.channel.type !== "text") throw new Error(`Attempt to use ArgumentType.VOICE_CHANNEL outside of a guild.`);
				const channels = this.message.guild!.channels.cache.filter(c => c.type === "voice");
				for (let v of val) {
					if (ArgumentHelper.GetFor('#', v)) v = <string> ArgumentHelper.GetFor('#', v);
					const c = channels.find(x => x.id === v || x.name === v);
					if (c) args.push(c);
				}
				break;
			}
			case ArgumentType.GUILD_ROLE: {
				if (this.message.channel.type !== "text") throw new Error(`Attempt to use ArgumentType.GUILD_ROLE outside of a guild.`);
				const { roles } = this.message.guild!;
				for (let v of val) {
					const match = roleMention.exec(v);
					const r = roles.cache.find(x => x.id === (match ? match[1] : v) || x.name === v);
					if (r) args.push(r);
				}
				break;
			}
			case ArgumentType.TEXT_EMOJI: {
				if (this.message.channel.type !== "text") throw new Error(`Attempt to use ArgumentType.GUILD_ROLE outside of a guild.`);
				const { emojis } = this.message.guild!;
				for (let v of val) {
					const match = emojiPattern.exec(v);
					if (!match) continue;
					const emoji = emojis.cache.find(x => x.id === (match ? match[1] : v));
					if (emoji) args.push(emoji);
				}
				break;
			}
			default: return val;
		}
		return args;
	}

	isFlag(argument: string): boolean | undefined {
		// if (index > 0 && this.parsed.args[index - 1].startsWith("-") && this.args[index - 1] instanceof FlagArgumentWithValue) return true;
		if (!argument.startsWith('-'))
			return false;

		const longArgument  = argument.substr(2);
		const shortArgument = argument.substr(1);

		for (const i in this.args) {
			const arg = this.args[i];

			if (arg instanceof FlagArgument) {
				if (arg.name === longArgument || arg.short === shortArgument) {
					return true;
				}
			} else if (arg instanceof FlagArgumentWithValue) {
				const index = this.parsed.args.indexOf(argument) + 1;
				const val = this.parsed.args[index];
				if (val !== null) {
					this.flagValues.push({ arg, val });
					this.parsed.args.splice(index, 1);
				}
				if (arg.name === longArgument || arg.short === shortArgument) {
					return true;
				}
			}
		}

		return false;
	}

	async validateArguments() {
		// for (const argument of this.args) {
		// 	if (!argument.optional) {
		// 		const val = this.getNotFlagValue(argument)
		// 	}
		// }
	}

	private findArg(name: string): number {
		let id = -1;
		for (const arg in this.args) {
			if (this.args[arg].name === name || this.args[arg].short === name) {
				id = Number(arg);
			}
		}
		return id;
	}

	async get<T = any>(name: string): Promise<T | T[] | undefined> {
		let arg: BaseArgument;
		await this.validateArguments();
		const id = this.findArg(name);
		if (id !== -1) {
			arg = this.args[id];
			if (arg instanceof FlagArgument || arg instanceof FlagArgumentWithValue) {
				return await this.getFlagValue(arg);
			} else {
				const res = await this.parse(arg, arg.repeating ? this.notFlags.slice(id) : [await this.getNotFlagValue(arg)]);
				return arg.repeating ? res : res[0];
			}
		}
	}

	private async getFlagValue(arg: BaseArgument): Promise<any> {
		if (arg instanceof FlagArgument) {
			return this.parsed.args.includes(`--${arg.name}`) || this.parsed.args.includes(`-${arg.short}`)
		} else if (arg instanceof FlagArgumentWithValue) {
			const e = this.flagValues.find(x => x.arg === arg);
			return e ? e.val : null;
		}
	}

	private getIndex(name: string): number {
		for (const arg in this.args) {
			if (this.args[arg].name === name)
				return arg as unknown as number;
		}

		return -1;
	}

	private getNotFlagValue(arg: BaseArgument) {
		const index = this.getIndex(arg.name);

		let only: boolean = true;
		if (arg instanceof RequiredArgument) {
			for (const arg in this.args) {
				if (this.args[arg] instanceof RequiredArgument) {
					only = false;
				}
			}

			if (only) {
				return this.notFlags.join(' ');
			} else {
				const arg = this.notFlags[index];
				if (arg)
					return arg;
			}
		}
	}
}
