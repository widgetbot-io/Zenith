import { Bot } from '../src';

const bot = new Bot({
	token: 'changeme',
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
		channel: {
			amount: 10,
			timeout: 10000
		},
		user: {
			amount: 5,
			timeout: 5000
		}
	}
}, {});

bot.setup();
bot.connect();
