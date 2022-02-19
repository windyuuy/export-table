"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSpace = exports.makeFirstLetterLower = exports.makeFirstLetterUpper = exports.foreach = exports.st = exports.cmm = exports.stdtemp = void 0;
/**
 * 标准模板文本
 * @param s
 * @returns
 */
function stdtemp(s) {
    return s;
}
exports.stdtemp = stdtemp;
/**
 * 注释
 * @param a
 * @returns
 */
function cmm(a) { return ""; }
exports.cmm = cmm;
/**
 * 表达式
 * @param f
 * @returns
 */
function st(f) {
    return f();
}
exports.st = st;
/**
 * 遍历列表生成字符串
 * - 会自动去除头尾多余的换行符(LF)
 * @param ls
 * @param f
 * @returns
 */
function foreach(ls, f, sign = "\n", autoTrim = true) {
    let line = ls.map(e => {
        let sl = f(e);
        if (autoTrim) {
            if (sl.startsWith("\n")) {
                sl = sl.substring(1);
            }
            if (sl.endsWith("\n")) {
                sl = sl.substring(0, sl.length - 1);
            }
        }
        return sl;
    }).join(sign);
    return line;
}
exports.foreach = foreach;
/**
 * 首字母大写
 * @param str
 * @returns
 */
function makeFirstLetterUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.makeFirstLetterUpper = makeFirstLetterUpper;
/**
 * 首字母小写
 * @param str
 * @returns
 */
function makeFirstLetterLower(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
exports.makeFirstLetterLower = makeFirstLetterLower;
function clearSpace(value) {
    return value.replace(/^(\r|\n|\t| )+$/gm, "");
}
exports.clearSpace = clearSpace;
//# sourceMappingURL=Utils.js.map