import {
	BaseArgument,
	BaseFlagArgument,
	FlagArgument,
	FlagArgumentWithValue,
	OptionalArgument,
	RequiredArgument
} from './Bases';
import {ArgumentType, ICommand, Parsed} from '../interfaces';
import {GuildChannel, Message} from "discord.js";
import {NoArgumentValue} from '../Exceptions';

export class ArgumentHelper {
	private flagValues: { [name: string]: string } = {};
	private cache: { [key: string]: any } = {};
	private readonly args: BaseArgument[];
	public notFlags: any[];
	public flags: any[];

	constructor(public command: ICommand, public parsed: Parsed, public content: string, private message: Message) {
		this.args = this.command.arguments || [];

		this.flags = this.parsed.args.filter(arg => this.isFlag(arg));
		this.notFlags = this.parsed.args.filter(arg => !this.flags.find(a => a === arg));
	}

	async argString(): Promise<string> {
		const flags = this.parsed.stringy.split(' ')
			.filter(a => this.isFlag(a))
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
		if (!usage.startsWith(`<${ic}`) || !usage.endsWith('>')) return; // Ensures it's the proper format.
		return usage.substr(ic.length + 1, usage.length - ic.length - 2); // Returns just the ID.
	}

	private async parse(arg: BaseArgument, val: string): Promise<any> {
		if (!val) return undefined;

		if (this.cache[arg.name]) return this.cache[arg.name];
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
				let newVal: string | undefined; // TODO: Localization
				if (this.message.channel.type !== 'text') throw new Error(`Attempt to use ArgumentType.TEXT_CHANNEL outside of a guild.`);
				const channels = this.message.guild!.channels.cache.filter(c => c.type === 'text');

				if (ArgumentHelper.GetFor('#', val)) newVal = ArgumentHelper.GetFor('#', val);

				const channel: GuildChannel | undefined = channels.find(c => c.id === newVal || c.id === val);
				if (channel) {
					this.cache[arg.name] = channel;
					return this.cache[arg.name];
				}
				break;
			}
			default:
				return String(val);
		}
	}

	isFlag(argument: string): boolean | undefined {
		// if (index > 0 && this.parsed.args[index - 1].startsWith("-") && this.args[index - 1] instanceof FlagArgumentWithValue) return true;
		if (!argument.startsWith('-'))
			return false;

		const longArgument = argument.substr(2);
		const shortArgument = argument.substr(1);

		for (const i in this.args) {
			const arg = this.args[i];

			if (arg instanceof FlagArgument) {
				if (arg.name === longArgument || arg.short === shortArgument) return true;
			} else if (arg instanceof FlagArgumentWithValue) {
				if (arg.name === longArgument || arg.short === shortArgument) {
					const index = this.parsed.args.indexOf(argument);
					this.flagValues[arg.name] = this.parsed.args[index + 1];
					delete this.parsed.args[index + 1]; // the val
					return true;
				}
			}
		}

		return false;
	}

	private findArg(name: string): [number, boolean] {
		for (const arg in this.args) {
			const indexedArg = this.args[arg];

			if (indexedArg instanceof BaseFlagArgument) if (indexedArg.name === name || indexedArg.short === name) return [Number(arg), true];
			if (indexedArg.name === name) return [Number(arg), false]
		}
		return [-1, false]
	}

	async get<T = any>(name: string): Promise<T | undefined> {
		let arg: BaseArgument;

		const [id, flag] = this.findArg(name);

		if (id !== -1) {
			arg = this.args[id];
			if (flag) {
				return await this.getFlagValue(arg);
			} else {
				if (arg instanceof RequiredArgument) {
					const val = this.getNotFlagValue(arg);
					if (!val) throw new NoArgumentValue(`Missing argument ${arg.name}`, arg);

					return this.parse(arg, val);
				} else {
					return await this.parse(arg, await this.getNotFlagValue(arg));
				}
			}
		}
	}

	private async getFlagValue(arg: BaseFlagArgument): Promise<any> {
		if (arg instanceof FlagArgument) {
			return this.parsed.args.includes(`--${arg.name}`) || this.parsed.args.includes(`-${arg.short}`)
		} else if (arg instanceof FlagArgumentWithValue) {
			return this.flagValues[arg.name];
		}
	}

	private getIndex(name: string): number {
		for (const arg in this.args) {
			if (this.args[arg].name === name)
				return arg as unknown as number;
		}

		return -1;
	}

	private getNotFlagValue(arg: RequiredArgument | OptionalArgument) {
		const index = this.getIndex(arg.name);

		let only: boolean = true;
		for (const arg in this.args) {
			if (this.args[arg] instanceof RequiredArgument) {
				only = false;
			}
		}

		if (only) {
			return this.notFlags.join(' ');
		} else {
			const notFlag = this.notFlags[index];
			if (notFlag)
				return notFlag;
		}
	}
}
