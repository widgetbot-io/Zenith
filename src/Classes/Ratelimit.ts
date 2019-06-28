export enum RatelimitType {
    CHANNEL,
    USER
}
interface Limit {
    amount: number,
    time: Date
}
interface LimitSettings {
    user: {
        amount: number,
        time: number
    },
    channel: {
        amount: number,
        time: number
    }
}

export class Ratelimit {
    private limits: LimitSettings = {
        user: {
            amount: 4,
            time: 600
        },
        channel: {
            amount: 10,
            time: 1000
        }
    };

    private channelLimits: {[key: string]: Limit} = {};
    private userLimits: {[key: string]: Limit} = {};

    constructor() {}

    async increment(Id: string, type: RatelimitType): Promise<void> {
        switch (type) {
            case RatelimitType.USER: {
                const limit = this.userLimits[Id];
                if (!limit) {
                    this.userLimits[Id] = {
                        amount: 1,
                        time: new Date()
                    };
                } else {
                    limit.amount = limit.amount +1;
                    limit.time = new Date();
                }
                break;
            }
            case RatelimitType.CHANNEL: {
                const limit = this.channelLimits[Id];
                if (!limit) {
                    this.channelLimits[Id] = {
                        amount: 1,
                        time: new Date()
                    };
                } else {
                    limit.amount = limit.amount +1;
                    limit.time = new Date();
                }
                break;
            }
        }
    }

    async checkExists(channel: string, user: string): Promise<void> {
        if (!this.channelLimits[channel]) {
            this.channelLimits[channel] = {
                amount: 0,
                time: new Date()
            };
        }
        if (!this.userLimits[user]) {
            this.userLimits[user] = {
                amount: 0,
                time: new Date()
            };
        }
    }

    async checkRatelimit(channelId: string, userId: string, type?: RatelimitType): Promise<boolean> {
        await this.checkExists(channelId, userId);
        switch (type) {
            case RatelimitType.CHANNEL: { break; }
            case RatelimitType.USER: { break; }
            default: {
                if (this.channelLimits[channelId].amount >= this.limits.channel.amount) {
                    if (this.channelLimits[channelId].time.getTime() + this.limits.channel.time < new Date().getTime()) {
                        console.log('You were ratelimited by have passed the needed time to bypass the ratelimit, resetting count. Channel');
                        this.channelLimits[channelId].amount = 0;
                    } else {
                        console.log('You are currently ratelimited by channel.');
                        return false;
                    }
                } else {
                    console.log('You are not ratelimited by channel...')
                }
                if (this.userLimits[userId].amount >= this.limits.user.amount) {
                    if (this.userLimits[userId].time.getTime() + this.limits.user.time < new Date().getTime()) {
                        console.log('You were ratelimited by have passed the needed time to bypass the ratelimit, resetting count. User');
                        this.userLimits[userId].amount = 0;
                    } else {
                        console.log('You are currently ratelimited by user.');
                        return false;
                    }
                } else {
                    console.log('You are not ratelimited by user...');
                }
            }
        }
        return true;
    }
}