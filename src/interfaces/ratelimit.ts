export interface Limit {
	amount: number,
	timeout: typeof setTimeout
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
