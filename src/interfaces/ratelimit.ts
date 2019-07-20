import Timeout = NodeJS.Timeout;

export interface Limit {
	amount: number,
	timeout: Timeout,
	set: Date
}
export interface LimitSettings {
	user: {
		amount: number,
		timeout: number
	},
	channel: {
		amount: number,
		timeout: number
	}
}

export enum RatelimitType {
	CHANNEL,
	USER
}
