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
exports.handler = exports.builder = exports.describe = exports.command = void 0;
const WorkbookManager_1 = require("../table/WorkbookManager");
const xxtea = require("xxtea-node");
const pako = require("pako");
const fs = require("fs");
const path_1 = require("path");
exports.command = 'export <from> <to>';
exports.describe = '导出表格，可以每张表格单独导出，或是全部数据一起导出。';
function builder(yargs) {
    return yargs
        .string("from")
        .string("to")
        .string("one").describe("one", "导出单张表格的模板")
        .string("onename").describe("one", "名称模板，会自动替换name为表名")
        .array("alls").describe("alls", "导出所有数据的模板 可以为多个")
        .array("allnames").describe("allnames", "导出所有数据的文件名 数量必须和alls匹配")
        .array("inject").describe("inject", "注入到模板中的boolean形变量，可以间接控制模板功能")
        .string("packagename").describe("packagename", "包名称")
        .boolean("tableNameFirstLetterUpper").describe("tableNameFirstLetterUpper", "talbe首字母大写")
        .demand(["from", "to"])
        .help("h");
}
exports.builder = builder;
function encrypt(str, key, deflate) {
    //先压缩再加密
    if (deflate) {
        let deflateValue = pako.deflate(str);
        return xxtea.encryptToString(deflateValue, key);
    }
    else {
        return xxtea.encryptToString(str, key);
    }
}
function clearSpace(value) {
    return value.replace(/^(\r|\n|\t| )+$/gm, "");
}
function firstLetterUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
;
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let from = argv.from;
        let to = argv.to;
        let one = argv.one;
        let onename = argv.onename;
        let alls = argv.alls || [];
        let allnames = argv.allnames || [];
        let inject = argv.inject || [];
        let packagename = argv.packagename;
        let tableNameFirstLetterUpper = argv.tableNameFirstLetterUpper;
        let injectMap = {};
        for (let k of inject) {
            injectMap[k] = true;
        }
        if (onename == null) {
            onename = `name.${one}`;
        }
        //加载所有表格数据
        let workbookManager = new WorkbookManager_1.default();
        yield workbookManager.build(from); //加载所有表
        workbookManager.checkError();
        {
            //导出每张表
            for (let table of workbookManager.dataTables) {
                if (tableNameFirstLetterUpper) {
                    table.name = firstLetterUpper(table.name);
                }
                console.log(table.name);
                let paras = {
                    name: table.name,
                    tables: workbookManager.dataTables,
                    fields: table.fields.filter(a => a.skip == false),
                    datas: table.getDataList(),
                    objects: table.getObjectList(),
                    xxtea: encrypt,
                    inject: injectMap,
                    packagename: packagename
                };
                // console.log(paras.datas)
                let ps = one.split(":");
                let cmd = ps[1];
                let plugin = ps[0];
                var ExportPlugin;
                try {
                    ExportPlugin = require("export-table-pulgin-" + plugin).ExportPlugin;
                }
                catch (_a) {
                    console.error(`plugin not found: <${plugin}>`);
                }
                if (ExportPlugin != undefined) {
                    const plugin = new ExportPlugin();
                    if (typeof (plugin[cmd]) == "function") {
                        let result = plugin[cmd](paras);
                        if (result != null) {
                            fs.writeFileSync((0, path_1.join)(to, onename.replace("name", table.name)), clearSpace(result));
                        }
                        return;
                    }
                    else {
                        console.error(`cmd not found: <${cmd}>`);
                    }
                }
                // console.log(join(to,onename.replace("name",table.name)));
            }
        }
    });
}
exports.handler = handler;
//# sourceMappingURL=export.js.map