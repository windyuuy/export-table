"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSpace = exports.makeFirstLetterLower = exports.makeFirstLetterUpper = exports.foreach = exports.st = exports.cmm = void 0;
function cmm(a) { return ""; }
exports.cmm = cmm;
function st(f) {
    return f();
}
exports.st = st;
function foreach(ls, f) {
    return ls.map(e => f(e)).join("\n");
}
exports.foreach = foreach;
function makeFirstLetterUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.makeFirstLetterUpper = makeFirstLetterUpper;
function makeFirstLetterLower(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
exports.makeFirstLetterLower = makeFirstLetterLower;
function clearSpace(value) {
    return value.replace(/^(\r|\n|\t| )+$/gm, "");
}
exports.clearSpace = clearSpace;
//# sourceMappingURL=Utils.js.map