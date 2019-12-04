import {BaseArgument, FlagArgument, FlagArgumentWithValue, RequiredArgument} from './Bases';
import {ArgumentType, ICommand, Parsed} from '../interfaces';
import {Message} from "discord.js";

export class ArgumentHelper {
	private readonly args: BaseArgument[];
	public flags: any[];
	public notFlags: any[];
	constructor(public command: ICommand, public parsed: Parsed, public content: string, private message: Message) {
		this.args = this.command.arguments || [];

		this.flags = this.parsed.args.filter((arg: string, i: number) => this.isFlag(arg, i));
		this.notFlags = this.parsed.args.filter((arg: string, i: number) => !this.flags.find(a => a === arg));
	}

	async argString(): Promise<string> {
		const flags = this.parsed.stringy.split(' ')
			.filter((a, i) => this.isFlag(a, i))
			.map(a => a.startsWith("--") && a.substr(2) || a.substr(1));
		let { stringy: argString } = this.parsed;
		for (const flag of flags) {
			const val = await this.get(flag);
			if (val) {
				argString = argString
				.replace(`--${flag} ${val} `, '')
				.replace(`--${flag} ${val}`, '')
				.replace(`--${flag}`, '')
				.replace(`-${flag}`, '');
			} else {
				argString = argString
					.replace(`-${flag}`, '')
					.replace(`--${flag}`, '');
			}
		}

		return argString.trim();
	}

	private static GetFor(ic: string, usage: string): string | undefined {
		if(!usage.startsWith(`<${ic}`) || !usage.endsWith('>')) return; // Ensures it's the proper format.
		return usage.substr(ic.length + 1, usage.length - ic.length - 2); // Returns just the ID.
	}

	private async parse(arg: BaseArgument, val: string): Promise<any> {
		switch (arg.type) {
			case ArgumentType.BOOLEAN: {
				if (Boolean(val)) return Boolean(val);
				throw new Error('Invalid Boolean');
			}
			case ArgumentType.NUMBER: {
				if (!isNaN(Number(val))) return Number(val);
				throw new Error('Invalid Number');
			}
			case ArgumentType.GUILD_MEMBER: {
				// TODO: Make sure they use it in a guild
				// TODO: Return a GuildMember

				break;
			}
			case ArgumentType.TEXT_CHANNEL: {
				let channels, channel, id;
				// TODO: Make sure they use it in a guild
				// TODO: Stop DM channel retards
				channels = this.message.guild!.channels;
				const getFor = ArgumentHelper.GetFor(`#`, val);
				if (getFor) id = getFor;
				channel = channels.find(c => c.id === val);
				if (channel) return channel;

				// TODO: Implement shit for like > 1 channels

				throw new Error(`Invalid text channel`)
			}
			default:
				return String(val);
		}
	}

	isFlag(argument: string, index: number): boolean | undefined {
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
				if (arg.name === longArgument || arg.short === shortArgument) {
					return true;
				}
			}
		}

		return true;
	}

	async get(name: string) {
		// TODO: Implement proper optional support
		// TODO: Throw something like "You are missing argument xxx"
		let id: number = -1, arg: BaseArgument;
		for (const arg in this.args) {
			if (this.args[arg].name === name || this.args[arg].short === name) {
				id = Number(arg);
			}
		}

		if (id !== -1) {
			arg = this.args[id];
			if (arg instanceof FlagArgument || arg instanceof FlagArgumentWithValue) {
				return await this.getFlagValue(arg);
			} else {
				return await this.getNotFlagValue(arg);
			}
		}
	}

	private async getFlagValue(arg: BaseArgument): Promise<any> {
		if (arg instanceof FlagArgument) {
			return this.parsed.args.includes(`--${arg.name}`) || this.parsed.args.includes(`-${arg.short}`)
		} else if (arg instanceof FlagArgumentWithValue) {
			const index = this.parsed.args.indexOf(`--${arg.name}`);
			if (index && index >= 0) {
				const value = this.parsed.args[index + 1];
				if (value)
					return value;
			}
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
