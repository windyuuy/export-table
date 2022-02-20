"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkbookMeta = exports.WorkbookExtendMode = void 0;
/**
 * 继承模式
 */
var WorkbookExtendMode;
(function (WorkbookExtendMode) {
    WorkbookExtendMode["Sub"] = "-";
    WorkbookExtendMode["Add"] = "+";
})(WorkbookExtendMode = exports.WorkbookExtendMode || (exports.WorkbookExtendMode = {}));
class WorkbookMeta {
    name;
    workbook;
    data;
    constructor(
    /**
     * 源名称
     */
    name, workbook, data) {
        this.name = name;
        this.workbook = workbook;
        this.data = data;
    }
    /**
     * 导出模式
     */
    extendMode = WorkbookExtendMode.Add;
    sheetMetas = [];
    addSheetMeta(sheetMeta) {
        this.sheetMetas.push(sheetMeta);
    }
    getMetaSheetNames() {
        return this.data.map(col => {
            return col.find(cell => {
                return typeof (cell) == "string" && cell.startsWith("#sheet ");
            });
        });
    }
    applyMeta(dataTables) {
        for (const sheetMeta of this.sheetMetas) {
            let dataTable = dataTables.find(t => t.sheet == sheetMeta.sheet);
            dataTable.applyMeta(sheetMeta);
        }
    }
}
exports.WorkbookMeta = WorkbookMeta;
//# sourceMappingURL=WorkbookMeta.js.map