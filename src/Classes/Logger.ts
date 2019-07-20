import * as log4js from 'log4js';

// import * as sentry from '@sentry/node';
// import { Config } from '.';

log4js.configure({
	appenders: {
		out: { type: 'stdout' },
		app: {
			type: 'dateFile',
			filename: 'logs/main.log',
			compress: false,
		},
	},
	categories: {
		default: {
			appenders: ['app', 'out'],
			level: 'debug',
		},
	},
});

/*
let sentryEnabled: boolean = false;
if (Config.get('SENTRY_DSN') && !sentryEnabled) {
	sentryEnabled = true;
	sentry.init({
		dsn: Config.get('SENTRY_DSN')
	});
} */

export class Logger {
	private rawLogger: log4js.Logger;
	constructor(private name: string, private id?: string) {
		this.rawLogger = log4js.getLogger(`${name}${id && `[${id}]` || ''}`);
	}

	static Info(prefix: string, msg: any, ...args: any[]) {
		const logger = log4js.getLogger(prefix);
		return logger.info(msg, ...args);
	}

	static Debug(prefix: string, msg: any, ...args: any[]) {
		const logger = log4js.getLogger(prefix);
		return logger.debug(msg, ...args);
	}

	static Warn(prefix: string, msg: any, ...args: any[]) {
		const logger = log4js.getLogger(prefix);
		return logger.warn(msg, ...args);
	}

	static Error(prefix: string, msg: any, ...args: any[]) {
		const logger = log4js.getLogger(prefix);
		return logger.error(msg, ...args);
	}

	static Fatal(prefix: string, msg: any, ...args: any[]) {
		const logger = log4js.getLogger(prefix);
		return logger.fatal(msg, ...args);
	}

	static Trace(prefix: string, msg: any, ...args: any[]) {
		const logger = log4js.getLogger(prefix);
		return logger.trace(msg, ...args);
	}

	info(Msg: any, ...args: any[]) {
		return this.rawLogger.info(Msg, ...args);
	}

	debug(Msg: any, ...args: any[]) {
		return this.rawLogger.debug(Msg, ...args);
	}

	warn(Msg: any, ...args: any[]) {
		return this.rawLogger.warn(Msg, ...args);
	}

	error(Msg: any, ...args: any[]) {
		return this.rawLogger.error(Msg, ...args);
	}

	fatal(Msg: any, ...args: any[]) {
		return this.rawLogger.fatal(Msg, ...args);
	}

	trace(Msg: any, ...args: any[]) {
		return this.rawLogger.trace(Msg, ...args);
	}

	/* sentry(err: any) {
		if (!sentryEnabled) return;
		// @ts-ignore
		sentry.configureScope(scope => {
			scope.setExtra('logger_name', `Logger: ${this.name}${this.id && `[${this.id}]` || ''}`)
		});
		return sentry.captureException(err);
	} */
}
