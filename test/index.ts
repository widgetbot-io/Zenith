import { Bot } from '../src';

const bot = new Bot({
	token: 'O w O',
	clientOptions: {
		disableEveryone: true,
	},
	prefix: '>>',
	roots: ['96626362277720064'],
	dirs: {
		commands: [`${__dirname}/Commands/**/*.**`],
		events: [`${__dirname}/Events/**/*.**`],
		modules: [`${__dirname}/Modules/*.**`]
	},
    limits: {
        user: {
            amount: 5,
            timeout: 7500
        },
        channel: {
            amount: 15,
            timeout: 10000
        }
    }
}, {});

bot.start();

