"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sheet_1 = require("../table/Sheet");
const LocalizationTable_1 = require("../table/LocalizationTable");
const WorkbookManager_1 = require("../table/WorkbookManager");
const Workbook_1 = require("../table/Workbook");
const fs = require("fs");
exports.command = 'genstrings <from> <to> [--lang zh]';
exports.describe = '从目标表中提取指定的多语言数据，产生/合并新的语言表';
function builder(yargs) {
    return yargs
        .string("from")
        .string("to")
        .string("lang").default("lang", "zh").describe("lang", "当前表格默认的语言")
        .demand(["from", "to"])
        .help("h");
}
exports.builder = builder;
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let from = argv.from;
        let to = argv.to;
        let lang = argv.lang;
        //创建新的数据表
        let resultSheet = new Sheet_1.default();
        resultSheet.name = "localization";
        let reusltLocal = new LocalizationTable_1.default(resultSheet);
        let workbookManager = new WorkbookManager_1.default();
        yield workbookManager.build(from); //加载所有表
        let tables = workbookManager.dataTables;
        for (let table of tables) {
            let fields = table.fields;
            if (!fields) {
                continue;
            }
            let uidFiled = fields.find(a => a.type == "uid");
            if (uidFiled == null) {
                console.log(table.name, "没有唯一key 无法自动生成key");
                continue;
            }
            let objList = table.getObjectList();
            for (let f of fields) {
                if (f.translate) {
                    for (let o of objList) {
                        let value = o[f.name];
                        if (value == null || value.trim() == "") {
                            console.log(table.name, o[uidFiled.name], "值为空 跳过");
                            continue;
                        }
                        reusltLocal.setValue(table.name + "/" + o[uidFiled.name] + "/" + f.name, lang, o[f.name]);
                    }
                }
            }
        }
        //导出表
        let resultBook = new Workbook_1.default();
        resultBook.filepath = to;
        resultBook.addSheet(resultSheet);
        //打开旧的表进行对比
        if (fs.existsSync(to)) {
            let oldExcel = new Workbook_1.default();
            oldExcel.load(to, fs.readFileSync(to));
            let sheet = oldExcel.getSheet("localization");
            if (sheet == null) {
                console.error("旧的语言表中不包含localization页面");
                return;
            }
            let oldLocal = new LocalizationTable_1.default(sheet);
            let oldKeys = oldLocal.keys;
            let newKeys = reusltLocal.keys;
            console.log(oldKeys.length, newKeys.length);
            //将新的中不存在的表红
            for (let oldk of oldKeys) {
                if (newKeys.indexOf(oldk) == -1) {
                    oldLocal.setRowBackground(oldk, "FF0000");
                    console.log("lose key", oldk);
                }
            }
            //将新的key插入旧表
            for (let newk of newKeys) {
                if (oldKeys.indexOf(newk) == -1) {
                    oldLocal.setValue(newk, lang, reusltLocal.getValue(newk, lang));
                    oldLocal.setRowBackground(newk, "FFFF00");
                    console.log("add key", newk);
                }
            }
            fs.renameSync(to, to + "." + new Date().getTime().toString(36) + ".bk");
            resultBook = oldExcel;
        }
        let saved = resultBook.save();
        fs.writeFileSync(to, saved);
    });
}
exports.handler = handler;
//# sourceMappingURL=genstrings.js.map