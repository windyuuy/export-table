"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkbookManager = void 0;
const fs = require("fs");
const path = require("path");
const Workbook_1 = require("./Workbook");
const DataTable_1 = require("./DataTable");
const chalk_1 = require("chalk");
const SceneMetaManager_1 = require("./meta/SceneMetaManager");
class WorkbookManager {
    _list = [];
    _tables = null;
    meta = new SceneMetaManager_1.SceneMetaManager();
    constructor() {
    }
    applySceneConfig(scene0) {
        let scene = this.meta.scenes.find(s => s == scene0);
        if (scene == undefined) {
            return;
        }
        let dataTables = this.dataTables;
        for (let workbook of this._list) {
            let sceneMeta = workbook.metaManager.getSceneMeta(scene);
            if (sceneMeta != null) {
                sceneMeta.applyMeta(dataTables);
            }
        }
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
                for (let sheet of b.sheets) {
                    if (sheet && sheet.data.length >= 3) {
                        let datatable = new DataTable_1.DataTable(sheet, sheet.nameOrigin);
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
    getTableByName(name, workbookName) {
        return this.dataTables.find(a => a.nameOrigin == name && a.workbookName == workbookName);
    }
    /**
     * 检查所有表的错误
     */
    checkError() {
        this.dataTables.forEach(a => a.checkError());
    }
    collectScenes() {
        let scenes = [];
        this.workbooks.forEach(w => {
            for (let meta of w.metaManager.sceneMetas) {
                scenes.push(meta.name);
            }
        });
        return scenes;
    }
}
exports.WorkbookManager = WorkbookManager;
//# sourceMappingURL=WorkbookManager.js.map