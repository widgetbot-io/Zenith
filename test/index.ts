import { Bot } from '../src';

const bot = new Bot({
	token: 'Mzg1NTIxNzI4MjQ5NjU5Mzkz.XSoX2w.S-p6Xmv_DUMWT4GZxsVsMa2Wmuk',
	clientOptions: {
		disableEveryone: true,
	},
	prefix: '<<',
	roots: ['96626362277720064'],
	dirs: {
		commands: [`${__dirname}/Commands/**/*.**`],
		events: [`${__dirname}/Events/**/*.**`],
		modules: [`${__dirname}/Modules/*.**`]
	},
	limits: {
		user: {
			amount: 4,
			timeout: 5000
		},
		channel: {
			amount: 2,
			timeout: 5000
		}
	}
}, {});

bot.start();

