import {Limit, LimitSettings, RatelimitType} from "../interfaces";
import {Collection, Message} from 'discord.js'
import {Bot} from "../Bot";

export class RateLimit {
    constructor(private bot: Bot) {}
    private static channelLimits: Collection<string, Limit> = new Collection();
    private static userLimits: Collection<string, Limit> = new Collection();

    async increment(id: string, type: RatelimitType): Promise<void> {
        switch (type) {
            case RatelimitType.USER: {
                const limit = RateLimit.userLimits.get(id);
                if (!limit) return this.createLimit(id, RatelimitType.USER);
                else {
                    limit.amount = limit.amount + 1;
                    RateLimit.userLimits.set(id, limit);
                }
                break;
            }
            case RatelimitType.CHANNEL: {
                const limit = RateLimit.channelLimits.get(id);
                if (!limit) return this.createLimit(id, RatelimitType.CHANNEL);
                else {
                    limit.amount = limit.amount + 1;
                    RateLimit.channelLimits.set(id, limit);
                }
                break;
            }
        }
    }

    createLimit(id: string, type: RatelimitType) {
        const composableLimit = { amount: 0, set: new Date() };
        switch(type) {
            case RatelimitType.USER:
                RateLimit.userLimits.set(id, Object.assign(composableLimit, {timeout: setTimeout(this.passLimit(type, id), this.bot.settings.limits.user.timeout)}));
                break;
            case RatelimitType.CHANNEL:
                console.log('created channel')
                RateLimit.channelLimits.set(id, Object.assign(composableLimit, {timeout: setTimeout(this.passLimit(type, id), this.bot.settings.limits.channel.timeout)}));
                break;
        }
    }

    passLimit(type: RatelimitType, id: string) {
        return () => {
            console.log('passed')
            switch (type) {
                case RatelimitType.USER:
                    console.log('user')
                    RateLimit.userLimits.delete(id);
                    break;
                case RatelimitType.CHANNEL:
                    console.log('channel')
                    RateLimit.channelLimits.delete(id);
                    break;
            }
        }
    }

    async checkRatelimit(message: Message, channelId: string, userId: string, type?: RatelimitType): Promise<boolean> {
        const channel = RateLimit.channelLimits.get(channelId);
        const user = RateLimit.userLimits.get(userId);
        const channelLimit = this.bot.settings.limits.channel;
        const userLimit = this.bot.settings.limits.user;

        switch (type) {
            case RatelimitType.CHANNEL: {
                if (!channel) return false;
                message.channel.send(`This channel is currently rate-limited for xxx.`);
                return channel.amount >= this.bot.settings.limits.channel.amount;
            }
            case RatelimitType.USER: {
                if (!user) return false;
                message.channel.send(`You are currently rate-limited for xxx.`);
                return user.amount >= this.bot.settings.limits.user.amount;
            }
            default: {
                if (!user) {
                    this.createLimit(userId, RatelimitType.USER)
                    return false;
                } else if (!channel) {
                    this.createLimit(channelId, RatelimitType.CHANNEL)
                    return false;
                }
                console.log(channel.amount)
                console.log(RateLimit.calcTimeLeft(channel.set, new Date(), channelLimit.timeout));
                if (channel.amount >= channelLimit.amount) {
                    message.channel.send(`This channel is currently rate-limited. ${RateLimit.calcTimeLeft(channel.set, new Date(), channelLimit.timeout)}s left.`);
                    return true;
                } else if (user.amount >= userLimit.amount) {
                    message.channel.send(`You are currently rate-limited. ${RateLimit.calcTimeLeft(user.set, new Date(), userLimit.timeout)}s left.`);
                    return true;
                }

                return false;
            }
        }
    }

    static calcTimeLeft(setTime: Date, now: Date, timeout: number): number {
        // rounds to 2 DP
        return +(((timeout - ( now.getTime() - setTime.getTime()))/1000).toFixed(2))
    }

}
