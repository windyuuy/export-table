"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldMeta = exports.FieldExtendMode = void 0;
/**
 * 继承模式
 */
var FieldExtendMode;
(function (FieldExtendMode) {
    FieldExtendMode["Sub"] = "-";
    FieldExtendMode["Add"] = "+";
})(FieldExtendMode = exports.FieldExtendMode || (exports.FieldExtendMode = {}));
class FieldMeta {
    data;
    /**
     * 导出类型
     */
    type;
    /**
     * 导出名称
     */
    exportName;
    /**
     * 继承模式
     */
    extendMode = FieldExtendMode.Add;
    name;
    constructor(
    /**
     * 源名称
     */
    data) {
        this.data = data;
        let m = data.match(/(?:\:(\-))?(?:([\w]+)(?:\:(\w+))?\=)?(\w+)/);
        let sign = m[1];
        let exportName = m[2];
        let type = m[3];
        let fieldName = m[4];
        this.name = fieldName;
        this.exportName = exportName;
        this.type = type;
        this.extendMode = sign == "-" ? FieldExtendMode.Sub : FieldExtendMode.Add;
    }
}
exports.FieldMeta = FieldMeta;
//# sourceMappingURL=FieldMeta.js.map