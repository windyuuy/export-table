"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const Sheet_1 = require("./Sheet");
const xlsx = require("xlsx-color");
const bufferFrom = require("buffer-from");
class Workbook {
    constructor() {
        /**
         * 文件路径
         */
        this.filepath = "";
        this.sheets = [];
    }
    /**
     * 根据表格名称获取表格
     * @param name
     */
    getSheet(name) {
        return this.sheets.find(a => a.name == name);
    }
    /**
     * 保存表格到该工作簿
     * @param name
     * @param sheet
     */
    addSheet(sheet) {
        this.sheets.push(sheet);
    }
    /**
     * 移除表
     * @param sheet
     */
    removeSheet(sheet) {
        let index = this.sheets.indexOf(sheet);
        if (index != -1) {
            this.sheets.splice(index, 1);
        }
    }
    /**
     * 加载工作簿
     * @param buff
     */
    load(filepath, buff) {
        this.filepath = filepath;
        const workSheet = xlsx.read(buff, {});
        let names = Object.keys(workSheet.Sheets);
        for (let name of names) {
            const sheet = workSheet.Sheets[name];
            let s = new Sheet_1.default();
            s.name = name;
            let data = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: true });
            for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
                let row = data[rowIndex];
                for (let columIndex = 0; columIndex < row.length; columIndex++) {
                    s.setValue(rowIndex, columIndex, row[columIndex]);
                    let cell = xlsx.utils.encode_cell({ c: columIndex, r: rowIndex });
                    if (sheet[cell] && sheet[cell].c && sheet[cell].c[0] && sheet[cell].c[0].t) {
                        s.setDescribe(rowIndex, columIndex, sheet[cell].c[0].t);
                        // console.log(cell,sheet[cell].c[0].t)
                    }
                }
            }
            this.addSheet(s);
        }
    }
    /**
     * 保存工作布
     */
    save() {
        const defaults = {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary',
            cellStyles: true
        };
        let workBook = {
            SheetNames: [],
            Sheets: {}
        };
        for (let sheet of this.sheets) {
            workBook.SheetNames.push(sheet.name);
            workBook.Sheets[sheet.name] = sheet.xlsxData;
        }
        const excelData = xlsx.write(workBook, defaults);
        return bufferFrom(excelData, "binary");
    }
    /**
     * 文件名，包含扩展名
     */
    get filename() {
        return (0, path_1.basename)(this.filepath);
    }
    /**
     * 工作簿名称，不包含扩展名
     */
    get name() {
        return (0, path_1.basename)(this.filepath, ".xlsx");
    }
}
exports.default = Workbook;
//# sourceMappingURL=Workbook.js.map