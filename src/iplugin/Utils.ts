
export function cmm(a?: string) { return "" }
export function st(f: (a?: any) => string) {
	return f()
}
export function foreach<T>(ls: T[], f: (e: T) => string) {
	return ls.map(e => f(e)).join("\n")
}

export function makeFirstLetterUpper(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
export function makeFirstLetterLower(str: string) {
	return str.charAt(0).toLowerCase() + str.slice(1);
};
