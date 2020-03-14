// thanks viction#0001, go bother him :)
export class Parser {
	static parseArgs(argStr: string, allowQuotes?: boolean) {
		const Res = [];
		let InString = false;
		let StrChar = '';
		let Chr = '';
		let Escaped = false;
		const Str = argStr.split('');
		for (let i = 0; i < argStr.length; i++) {
			const Char = Str[i];
			if (!allowQuotes) {
				if (Escaped) {
					Chr = Chr + StrChar;
					Escaped = false;
					continue;
				}
				if (Char.match('["|\']') && !InString && !Escaped) {
					InString = true;
					StrChar = Char;
				}
				else if (Char.match('[\]')) {
					Escaped = true;
					continue;
				}
			}
			if (InString && Char === StrChar) {
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
				Chr = Chr + Char;
			}
		}
		if (Chr.trim().length !== 0) Res.push(Chr);
		return Res;
	}
}
