import {BaseArgument} from '../Classes';

export class NoArgumentValue extends Error {
	constructor(private error: string, public arg: BaseArgument) {
		super(error);

		Error.captureStackTrace(this, this.constructor);
	}
}
