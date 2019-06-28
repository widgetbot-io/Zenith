export interface Limit {
	amount: number,
	time: Date
}
export interface LimitSettings {
	user: {
		amount: number,
		time: number
	},
	channel: {
		amount: number,
		time: number
	}
}

export enum RatelimitType {
	CHANNEL,
	USER
}
