import {Limit, LimitSettings, RatelimitType} from "../interfaces";
import {Collection} from 'discord.js'

export class RateLimit {
    private static channelLimits: Collection<string, Limit> = new Collection();
    private static userLimits: Collection<string, Limit> = new Collection();

    private limits: LimitSettings = {
        user: {
            amount: 4,
            timeout: 2000
        },
        channel: {
            amount: 10,
            timeout: 5000
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
        const channel = RateLimit.channelLimits.get(channelId);
        const user = RateLimit.userLimits.get(userId);
        console.log(channel, user);
        if (!channel || !user) return false;
        return channel.amount >= this.limits.channel.amount || user.amount >= this.limits.user.amount;
    }

}
