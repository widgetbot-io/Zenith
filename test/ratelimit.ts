import { RateLimit } from '../src/Classes/RateLimit';
import { Client, Message } from 'discord.js';

const client = new Client();
console.log(client)
client.on('ready', () => console.log('logged in'));
const rl = new RateLimit();
client.on('message', async (msg: Message) => {
    await rl.increment(msg.channel!.id, 1);
    await rl.increment(msg.author!.id, 2);
    if (await rl.checkRatelimit(msg.channel!.id, msg.author!.id)) {
        return await msg.channel.send('You are currently rate-limited!') // TODO: Implement proper replies fo different ratelimits
    }
})

client.login('NTc3MTY0OTM4ODA0NTkyNjQx.XNhE_w.e9vG1bbKi07IIBeEAsn0d-diQNM')