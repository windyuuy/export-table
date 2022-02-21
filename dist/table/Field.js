"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const FieldMeta_1 = require("./meta/FieldMeta");
class Field {
    /**
     * 是否跳过该字段
     */
    skip = false;
    skipOrigin = false;
    name;
    nameOrigin;
    describe;
    type;
    index = -1;
    //外键
    fkTableName;
    fkFieldName;
    //翻译
    translate = false;
    constructor(name, describe, type) {
        this.nameOrigin = name;
        this.name = name;
        this.describe = describe;
        this.type = type;
    }
    get isFKField() {
        return this.fkTableName != null;
    }
    applyMeta(fieldMeta) {
        if (fieldMeta.exportName) {
            this.name = fieldMeta.exportName;
        }
        if (fieldMeta.type) {
            this.type = fieldMeta.type;
        }
        if (fieldMeta.extendMode == FieldMeta_1.FieldExtendMode.Sub) {
            this.skip = true;
        }
        else {
            this.skip = false;
        }
    }
}
exports.Field = Field;
//# sourceMappingURL=Field.js.map