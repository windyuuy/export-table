
/**
 * 标准模板文本
 * @param s 
 * @returns 
 */
export function stdtemp(s: string): string {
	return s
}

/**
 * 注释
 * @param a 
 * @returns 
 */
export function cmm(a?: string) { return "" }
/**
 * 表达式
 * @param f 
 * @returns 
 */
export function st(f: (a?: any) => string) {
	return f()
}
/**
 * 遍历列表生成字符串
 * - 会自动去除头尾多余的换行符(LF)
 * @param ls 
 * @param f 
 * @returns 
 */
export function foreach<T>(ls: T[], f: (e: T) => string, sign: string = "\n", autoTrim = true) {
	let line = ls.map(e => {
		let sl = f(e)
		if (autoTrim) {
			if (sl.startsWith("\n")) {
				sl = sl.substring(1)
			}
			if (sl.endsWith("\n")) {
				sl = sl.substring(0, sl.length - 1)
			}
		}
		return sl
	}).join(sign)
	return line
}

/**
 * 首字母大写
 * @param str 
 * @returns 
 */
export function makeFirstLetterUpper(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * 首字母小写
 * @param str 
 * @returns 
 */
export function makeFirstLetterLower(str: string) {
	return str.charAt(0).toLowerCase() + str.slice(1);
}

export function clearSpace(value: string) {
	return value.replace(/^(\r|\n|\t| )+$/gm, "");
}
