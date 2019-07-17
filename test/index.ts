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
	}
}, {});

bot.start();
