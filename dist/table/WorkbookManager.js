"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkbookManager = void 0;
const fs = require("fs");
const path = require("path");
const Workbook_1 = require("./Workbook");
const DataTable_1 = require("./DataTable");
const chalk_1 = require("chalk");
class WorkbookManager {
    _list = [];
    _tables = null;
    constructor() {
    }
    async build(buildPath) {
        let buildPromiseList = [];
        let fileList = fs.readdirSync(buildPath);
        for (let i = 0; i < fileList.length; i++) {
            let filePath = fileList[i];
            //点开头的为隐藏文件
            if (path.basename(filePath)[0] == "." || path.basename(filePath)[0] == "~") {
                continue;
            }
            let state = fs.statSync(path.join(buildPath, filePath));
            if (state.isDirectory()) {
                //继续向子目录查找
                buildPromiseList.push(this.build(path.join(buildPath, filePath)));
            }
            else if (path.extname(filePath) == ".xlsx") {
                //找到xls文件
                buildPromiseList.push(this.buildExcel(path.join(buildPath, filePath)));
            }
        }
        await Promise.all(buildPromiseList);
    }
    async buildExcel(excel) {
        var promise = new Promise((resolve, reject) => {
            fs.readFile(excel, (err, buffer) => {
                if (err) {
                    console.error(chalk_1.default.red(String(err)));
                    resolve();
                    return;
                }
                let workbook = new Workbook_1.Workbook();
                workbook.load(excel, buffer);
                this._list.push(workbook);
                resolve();
            });
        });
        return promise;
    }
    /**
     * 获取工作簿列表
     */
    get workbooks() {
        return this._list.concat();
    }
    /**
     * 获取数据列表
     */
    get dataTables() {
        if (this._tables == null) {
            this._tables = [];
            for (let b of this._list) {
                if (b.sheets.length >= 1) {
                    let sheet = b.sheets[0];
                    if (sheet.name == "Sheet1") {
                        sheet.name = b.name;
                    }
                }
                for (let sheet of b.sheets) {
                    if (sheet && sheet.data.length >= 3) {
                        let datatable = new DataTable_1.DataTable(sheet, sheet.name);
                        datatable.manager = this;
                        this._tables.push(datatable);
                    }
                }
            }
        }
        return this._tables;
    }
    /**
     * 获取表名
     * @param name
     */
    getTableByName(name) {
        return this.dataTables.find(a => a.name == name);
    }
    /**
     * 检查所有表的错误
     */
    checkError() {
        this.dataTables.forEach(a => a.checkError());
    }
}
exports.WorkbookManager = WorkbookManager;
//# sourceMappingURL=WorkbookManager.js.map