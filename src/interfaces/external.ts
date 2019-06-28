export interface ILogger {
	info(text: string, ...args: any[]): void;
	debug(text: string, ...args: any[]): void;
	warn(text: string, ...args: any[]): void;
	error(text: string, ...args: any[]): void;
	fatal(text: string, ...args: any[]): void;
}

export interface IStaticLogger {
	Info(text: string, ...args: any[]): void;
	Debug(text: string, ...args: any[]): void;
	Warn(text: string, ...args: any[]): void;
	Error(text: string, ...args: any[]): void;
	Fatal(text: string, ...args: any[]): void;
}

export interface IConfig {
	get(key: string, def?: string): Promise<string> | string;
}
