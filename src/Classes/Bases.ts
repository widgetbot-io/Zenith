import {BaseArgumentOptions, ArgumentType} from '../interfaces';

export class BaseArgument {
	public name: string;
	public optional: boolean;
	public short?: string;
	public type?: ArgumentType;
	public repeating?: boolean;
	constructor(options: BaseArgumentOptions) {
		this.type = options.type;
		this.name = options.name;
		this.optional = options.optional || false;
		this.short = options.short;
		this.repeating = options.repeating;
	}
}

export class OptionalArgument extends BaseArgument {
	constructor(options: BaseArgumentOptions) {
		super(Object.assign(options, {
			optional: true // TODO: Make this less awkward
		}));
	}
}
export class RequiredArgument extends BaseArgument {
	constructor(options: BaseArgumentOptions) {
		super(Object.assign(options, {
			optional: false // TODO: Make this less awkward
		}));
	}
}

export class FlagArgument extends OptionalArgument {
	public short?: string;

	constructor(options: BaseArgumentOptions) {
		if (options.repeating) options.repeating = undefined; // Prevent flags from repeating
		super(options);
	}
}
export class FlagArgumentWithValue extends OptionalArgument {
	public short?: string;
	constructor(options: BaseArgumentOptions) {
		if (options.repeating) options.repeating = undefined; // Prevent flags from repeating
		super(options);
	}
}
