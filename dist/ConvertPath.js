"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPath = void 0;
const path_1 = require("path");
function convertPath(filepath) {
    if (filepath[0] == "/" || filepath[0] == "\\" || filepath[1] == ":") {
        //绝对路径
        return filepath;
    }
    else {
        return path_1.join(process.cwd(), filepath);
    }
}
exports.convertPath = convertPath;
//# sourceMappingURL=ConvertPath.js.map