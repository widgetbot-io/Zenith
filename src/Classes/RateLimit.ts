import {Limit, LimitSettings, RatelimitType} from "../interfaces";
import {Collection} from 'discord.js'

export class RateLimit {
    private static channelLimits: Collection<string, Limit> = new Collection();
    private static userLimits: Collection<string, Limit> = new Collection();

    private limits: LimitSettings = {
        user: {
            amount: 4,
            timeout: 600
        },
        channel: {
            amount: 10,
            timeout: 1000
        }
    };

    async increment(id: string, type: RatelimitType): Promise<void> {
        switch (type) {
            case RatelimitType.USER: {
                const limit = RateLimit.userLimits.get(id);
                if (!limit) return this.createLimit(id, RatelimitType.USER)
                else {
                    limit.amount = limit.amount + 1;
                    RateLimit.userLimits.set(id, limit);
                }
                break;
            }
            case RatelimitType.CHANNEL: {
                const limit = RateLimit.channelLimits.get(id);
                if (!limit) return this.createLimit(id, RatelimitType.CHANNEL)
                else {
                    limit.amount = limit.amount + 1;
                    RateLimit.channelLimits.set(id, limit);
                }
                break;
            }
        }
    }

    createLimit(id: string, type: RatelimitType) {
        const defaultLimit = {
            amount: 1
        };
        switch(type) {
            case RatelimitType.USER:
                RateLimit.userLimits.set(id, Object.assign(defaultLimit, {timeout: setTimeout(this.passLimit(type, id), this.limits.user.timeout)}))
                break;
            case RatelimitType.CHANNEL:
                RateLimit.channelLimits.set(id, Object.assign(defaultLimit, {timeout: setTimeout(this.passLimit(type, id), this.limits.channel.timeout)}))
                break;
        }
    }

    passLimit(type: RatelimitType, id: string) {
        return () => {
            switch (type) {
                case RatelimitType.USER:
                    RateLimit.userLimits.delete(id);
                    break;
                case RatelimitType.CHANNEL:
                    RateLimit.channelLimits.delete(id);
                    break;
            }
        }
    }
    

    async checkRatelimit(channelId: string, userId: string, type?: RatelimitType): Promise<boolean> {
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
