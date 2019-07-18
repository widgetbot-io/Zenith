import { Bot } from '../src';

const bot = new Bot({
	token: 'Mzg1NTIxNzI4MjQ5NjU5Mzkz.XS-Qhw.vspW03hY4VEXB1I-0RrFVFHaUaU',
	clientOptions: {
		disableEveryone: true,
	},
	prefix: '<>',
	roots: ['96626362277720064'],
	dirs: {
		commands: [`${__dirname}/Commands/**/*.**`],
		events: [`${__dirname}/Events/**/*.**`],
		modules: [`${__dirname}/Modules/*.**`]
	},
	limits: {
		user: {
			amount: 2,
			timeout: 5000
		},
		channel: {
			amount: 3,
			timeout: 50000
		}
	}
}, {});

bot.start();

