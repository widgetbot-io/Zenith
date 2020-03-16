import {BaseArgumentOptions, ArgumentType, FlagArgumentOptions} from '../interfaces';
import {MainArgumentOptions} from '../interfaces/arguments';

export class BaseArgument {
	public name: string;
	public description?: string;
	public type?: ArgumentType;
	constructor(options: BaseArgumentOptions, public optional = false) {
		this.description = options.description;
		this.type = options.type;
		this.name = options.name;
	}
}

export class RequiredArgument extends BaseArgument {
	constructor(options: MainArgumentOptions) {
		super({
			...options
		}, false);
	}
}

export class OptionalArgument extends BaseArgument {
	constructor(options: MainArgumentOptions) {
		super({
			...options
		}, true);
	}
}

export class BaseFlagArgument extends OptionalArgument {
	public short?: string;
	constructor(options: FlagArgumentOptions) {
		super(options);
		this.short = options.short;
	}
}

export class FlagArgument extends BaseFlagArgument {
	constructor(options: FlagArgumentOptions) {
		super(options);
	}
}
export class FlagArgumentWithValue extends BaseFlagArgument {
	constructor(options: FlagArgumentOptions) {
		super(options);
	}
}
