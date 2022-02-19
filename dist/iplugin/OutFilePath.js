"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutFilePath = void 0;
const path = require("path");
class OutFilePath {
    outPath;
    baseName;
    ext;
    constructor(
    /**
     * 导出路径
     */
    outPath, 
    /**
     * 文件名
     */
    baseName, 
    /**
     * 扩展名
     */
    ext) {
        this.outPath = outPath;
        this.baseName = baseName;
        this.ext = ext;
    }
    /**
     * 完整路径
     */
    get fullPath() {
        return path.join(this.outPath, this.baseName + this.ext);
    }
    merge(out) {
        this.outPath = out.outPath;
        this.baseName = out.baseName;
        this.ext = out.ext;
        return this;
    }
    clone() {
        return new OutFilePath(this.outPath, this.baseName, this.ext);
    }
}
exports.OutFilePath = OutFilePath;
//# sourceMappingURL=OutFilePath.js.map