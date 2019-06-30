import {ArgumentType, BaseArgumentOptions} from "../interfaces";

export class BaseArgument {
	public name: string;
	public optional: boolean;
	constructor(options: BaseArgumentOptions) {
		this.name = options.name;
		this.optional = options.optional;
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
	constructor(options: BaseArgumentOptions) {
		super(options);
	}
}
export class FlagArgumentWithValue extends OptionalArgument {
	constructor(options: BaseArgumentOptions) {
		super(options);
	}
}
