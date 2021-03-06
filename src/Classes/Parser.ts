// thanks viction#0001, go bother him :)
export class Parser {
	static parseArgs(argStr: string): string[] {
		const Res = [];
		let InString = false;
		let StrChar = '';
		let Chr = '';
		let Escaped = false;
		const Str = argStr.split('');
		for (let i = 0; i < argStr.length; i++) {
			const Char = Str[i];
			if (Escaped) {
				Chr += Char;
				Escaped = false;
				continue;
			}
			if (Char.match('["|\']') && !InString && !Escaped) {
				InString = true;
				StrChar = Char;
			}
			else if (Char.match('[\]')) {
				Escaped = true;
			}
			else if (InString && Char === StrChar) {
				Res.push(Chr.trim());
				Chr = '';
				InString = false;
			}
			else if (Char.match('[ ]') && !InString) {
				if (Chr !== '') {
					Res.push(Chr);
					Chr = '';
				}
			}
			else {
				Chr += Char;
			}
		}
		if (Chr.trim().length !== 0) Res.push(Chr);
		return Res;
	}
}
