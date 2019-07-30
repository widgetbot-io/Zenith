import {BaseArgument, FlagArgument, FlagArgumentWithValue, RequiredArgument} from './Bases';
import {ICommand} from '../interfaces';

export class ArgumentHelper {
	private readonly args: BaseArgument[];
	public flags: any[];
	public notFlags: any[];
	constructor(public command: ICommand, public parsed: any, public content: string) {
		this.args = this.command.arguments || [];

		this.flags = this.parsed.args.filter((arg: string) => this.isFlag(arg));
		this.notFlags = this.parsed.args.filter((arg: string) => !this.isFlag(arg));
	}

	isFlag(argument: string): boolean {
		if (!argument.startsWith('-'))
			return false;

		const longArgument = argument.substr(2);
		const shortArgument = argument.substr(1);

		for (const i in this.args) {
			const arg = this.args[i];

			if (arg instanceof FlagArgument) {
				if (arg.name === longArgument || arg.short === shortArgument) {
					return true;
				}
			} else if (arg instanceof FlagArgumentWithValue) {
				if (arg.name === longArgument || arg.short === shortArgument) {
					// @ts-ignore
					delete this.args[i + 1];
					return true;
				}
			}
		}

		return true;
	}

	async get(name: string) {
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
