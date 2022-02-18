"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
class Field {
    /**
     * 是否跳过该字段
     */
    skip = false;
    name;
    describe;
    type;
    //外键
    fkTableName;
    fkFieldName;
    //翻译
    translate = false;
    constructor(name, describe, type) {
        this.name = name;
        this.describe = describe;
        this.type = type;
    }
}
exports.Field = Field;
//# sourceMappingURL=Field.js.map