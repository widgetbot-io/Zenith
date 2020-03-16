import { Bot } from '../src';

const bot = new Bot({
	token: 'NjA0MDU2MjEyNzA2Njg5MDc2.Xm4bYQ.8Ry6g1JT0taMvbJ5Cx7L1_UjLXU',
	clientOptions: {
		disableMentions: 'everyone',
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
