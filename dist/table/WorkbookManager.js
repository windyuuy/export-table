"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Workbook_1 = require("./Workbook");
const DataTable_1 = require("./DataTable");
const chalk_1 = require("chalk");
class WorkbookManager {
    constructor() {
        this._list = [];
        this._tables = null;
    }
    build(buildPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let buildPromiseList = [];
            let list = fs.readdirSync(buildPath);
            for (let i = 0; i < list.length; i++) {
                let p = list[i];
                //点开头的为隐藏文件
                if (path.basename(p)[0] == "." || path.basename(p)[0] == "~") {
                    continue;
                }
                let state = fs.statSync(path.join(buildPath, p));
                if (state.isDirectory()) {
                    //继续向子目录查找
                    buildPromiseList.push(this.build(path.join(buildPath, p)));
                }
                else if (path.extname(p) == ".xlsx") {
                    //找到xls文件
                    buildPromiseList.push(this.buildExcel(path.join(buildPath, p)));
                }
            }
            for (let i = 0; i < buildPromiseList.length; i++) {
                yield buildPromiseList[i];
            }
        });
    }
    buildExcel(excel) {
        return __awaiter(this, void 0, void 0, function* () {
            var promise = new Promise((resolve, reject) => {
                fs.readFile(excel, (err, buffer) => {
                    if (err) {
                        console.error(chalk_1.default.red(String(err)));
                        resolve();
                        return;
                    }
                    let workbook = new Workbook_1.default();
                    workbook.load(excel, buffer);
                    this._list.push(workbook);
                    resolve();
                });
            });
            return promise;
        });
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
                let sheet = b.sheets[0];
                if (sheet && sheet.data.length >= 3) {
                    let datatable = new DataTable_1.default(sheet, b.name);
                    datatable.manager = this;
                    this._tables.push(datatable);
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
exports.default = WorkbookManager;
//# sourceMappingURL=WorkbookManager.js.map