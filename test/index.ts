import { Bot } from '../src';

const bot = new Bot({
	token: 'Mzg1NTIxNzI4MjQ5NjU5Mzkz.XS4BLg.S8RqAjxQUnwAD-8lkdd2hYhyOuI',
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
