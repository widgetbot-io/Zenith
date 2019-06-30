import { BaseArgument, FlagArgument, FlagArgumentWithValue, RequiredArgument } from './Bases';
import { Command } from '../interfaces';

export class ArgumentHelper {
	private args: BaseArgument[];
	public flags: any[];
	public notFlags: any[];
	constructor(public command: Command, public parsed: any, public content: string) {
		this.args = this.command.arguments;

		this.flags = this.parsed.args.filter((arg: string) => this.isFlag(arg));
		this.notFlags = this.parsed.args.filter((arg: string) => !this.isFlag(arg));
	}

	isFlag(argument: string): boolean {
		if (!argument.startsWith('-'))
			return false;

		argument = argument.substr(2);
		for (const arg of this.args) {
			if (arg instanceof FlagArgument) {
				if (arg.name === argument) {
					return true;
				}
			} else if (arg instanceof FlagArgumentWithValue) {
				if (arg.name === argument) {

				}
			}
		}

		return true;
	}

	async get(name: string) {
		let id: number = -1, arg: BaseArgument;
		for (const arg in this.args) {
			if (this.args[arg].name === name)
			// @ts-ignore TODO: make this less for'y and more not for'y
				id = arg;
		}

		if (id !== -1) {
			arg = this.args[Number(id)];
			if (arg instanceof FlagArgument || arg instanceof FlagArgumentWithValue) {
				return await this.getFlagValue(arg);
			} else {
				return await this.getNotFlagValue(arg);
			}
		}
	}

	private async getFlagValue(arg: BaseArgument): Promise<any> {
		if (arg instanceof FlagArgument) {
			return this.parsed.args.includes(`--${arg.name}`)
		} else if (arg instanceof FlagArgumentWithValue) {
			const index = this.parsed.args.indexOf(`--${arg.name}`);
			if (index && index >= 0) {
				const value = this.parsed.args[index + 1];
				if (value)
					return value;
			}
		}
	}

	private getNotFlagValue(arg: BaseArgument) {
		let only: boolean = true;
		if (arg instanceof RequiredArgument) {
			for (const arg of this.args) {
				if (arg instanceof RequiredArgument) {
					only = false;
				}
			}

			if (only) {
				return this.notFlags.join(' ');
			} else {
				// throw new Error(`Not implemented.`)
				return this.notFlags.join(' ');
			}
		}
	}

}
