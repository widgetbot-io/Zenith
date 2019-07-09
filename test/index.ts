import { Bot } from '../src';

const bot = new Bot({
	token: 'Mzg1NTIxNzI4MjQ5NjU5Mzkz.D3Jh-w.F8JTC6J3EB0dwqqtTdMDrFWXUzw',
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
