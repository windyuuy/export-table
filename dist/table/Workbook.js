"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workbook = void 0;
const path_1 = require("path");
const Sheet_1 = require("./Sheet");
const xlsx = require("xlsx-color");
const bufferFrom = require("buffer-from");
const SheetMeta_1 = require("./meta/SheetMeta");
const WorkbookMeta_1 = require("./meta/WorkbookMeta");
const WorkbookMetaManager_1 = require("./meta/WorkbookMetaManager");
const FieldMeta_1 = require("./meta/FieldMeta");
const chalk_1 = require("chalk");
class Workbook {
    /**
     * 文件路径
     */
    filepath = "";
    sheets = [];
    /**
     * 场景管理器
     */
    metaManager = new WorkbookMetaManager_1.WorkbookMetaManager();
    constructor() {
    }
    /**
     * 根据表格名称获取表格
     * @param name
     */
    getSheet(name) {
        return this.sheets.find(a => a.nameOrigin == name);
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
    addSceneMeta(sceneMeta) {
        this.metaManager.addSceneMeta(sceneMeta);
    }
    /**
     * 加载工作簿
     * @param buff
     */
    load(filepath, buff) {
        this.filepath = filepath;
        const workBook = xlsx.read(buff, {});
        let sheetNames = Object.keys(workBook.Sheets);
        let validSheetNames = sheetNames.filter(sheetName => !sheetName.endsWith(".meta"));
        for (let sheetName of validSheetNames) {
            const sheet = workBook.Sheets[sheetName];
            let s = new Sheet_1.Sheet();
            s.workbookName = this.name;
            if (sheetName == "Sheet1") {
                s.setupName(this.name);
                s.isDefault = true;
            }
            else {
                s.setupName(sheetName);
            }
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
        let metaSheets = sheetNames.filter(sheetName => sheetName.endsWith(".meta"));
        if (metaSheets.length > 0) {
            for (let metaSheetName of metaSheets) {
                const metaSheet = workBook.Sheets[metaSheetName];
                let data0 = xlsx.utils.sheet_to_json(metaSheet, { header: 1, raw: true });
                let data = [];
                if (data0.length >= 1) {
                    for (let i = 0; i < data0[0].length; i++) {
                        data[i] = [];
                    }
                }
                for (let i = 0; i < data0.length; i++) {
                    let row0 = data0[i];
                    for (let j = 0; j < row0.length; j++) {
                        data[j][i] = row0[j];
                    }
                }
                let m = metaSheetName.match(/(.+)\.meta/);
                let sceneMetaName = m[1];
                let sceneMeta = new WorkbookMeta_1.WorkbookMeta(sceneMetaName, this, data);
                this.addSceneMeta(sceneMeta);
                for (let isheet = 0; isheet < data.length; isheet++) {
                    let sheetMetaData = data[isheet];
                    let sheetMeta = new SheetMeta_1.SheetMeta(sheetMetaData);
                    sheetMeta.workbookName = this.name;
                    sceneMeta.addSheetMeta(sheetMeta);
                    let sheet = this.getSheet(sheetMeta.name);
                    if (sheet == null) {
                        let tip = `invalid sheet name in meta: ${sheetMeta.name}`;
                        console.error(chalk_1.default.red(tip));
                        throw new Error(tip);
                    }
                    sheetMeta.sheet = sheet;
                    let fieldMetaDatas = sheetMetaData.filter(d => !d.startsWith("#"));
                    for (let ifield = 0; ifield < fieldMetaDatas.length; ifield++) {
                        let fieldMetaData = fieldMetaDatas[ifield];
                        let fieldMeta = new FieldMeta_1.FieldMeta(fieldMetaData);
                        sheetMeta.addFieldMeta(fieldMeta);
                    }
                }
            }
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
            workBook.SheetNames.push(sheet.nameOrigin);
            workBook.Sheets[sheet.nameOrigin] = sheet.xlsxData;
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
exports.Workbook = Workbook;
//# sourceMappingURL=Workbook.js.map