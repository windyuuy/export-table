"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.describe = exports.command = void 0;
const WorkbookManager_1 = require("../table/WorkbookManager");
const xxtea = require("xxtea-node");
const pako = require("pako");
const path_1 = require("path");
const OutFilePath_1 = require("../iplugin/OutFilePath");
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
        .array("lib").describe("external npm modules path", "扩展npm模块路径")
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
function firstLetterUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
;
let ImportFailed = Symbol("FailedImport");
function tryImport(str) {
    try {
        return require(str);
    }
    catch { }
    return ImportFailed;
}
async function handler(argv) {
    let from = argv.from;
    let to = argv.to;
    let one = argv.one;
    let onename = argv.onename;
    let alls = argv.alls || [];
    let allnames = argv.allnames || [];
    let inject = argv.inject || [];
    let packagename = argv.packagename;
    let tableNameFirstLetterUpper = argv.tableNameFirstLetterUpper;
    let libs = argv.lib || [];
    let injectMap = {};
    for (let k of inject) {
        injectMap[k] = true;
    }
    //加载所有表格数据
    let workbookManager = new WorkbookManager_1.WorkbookManager();
    await workbookManager.build(from); //加载所有表
    workbookManager.checkError();
    let ps = one.split(":");
    let tag = ps[1];
    if (onename == null) {
        onename = `name.${tag}`;
    }
    let pluginName = ps[0];
    let pluginFullName = "export-table-pulgin-" + pluginName;
    let plugin;
    {
        console.log("libs:", libs);
        plugin = tryImport(pluginFullName);
        if (plugin == ImportFailed) {
            for (let lib of libs) {
                plugin = tryImport((0, path_1.join)(lib, pluginFullName));
                if (plugin != ImportFailed) {
                    break;
                }
            }
        }
    }
    if (plugin == ImportFailed) {
        console.error(`plugin not found: <${pluginName}>`);
        return;
    }
    let exportPlugins = plugin.ExportPlugins;
    exportPlugins = exportPlugins ?? [];
    let matchedPlugins = exportPlugins
        .filter(p => p.tags.indexOf(tag) >= 0);
    {
        //导出每张表
        console.log(`> handle sheets begin`);
        let tables = workbookManager.dataTables;
        for (let table of tables) {
            if (tableNameFirstLetterUpper) {
                table.name = firstLetterUpper(table.name);
            }
            if (matchedPlugins.length > 0) {
                console.log(`>> handle sheet ${table.name}:`);
                let paras = {
                    name: table.name,
                    tables: tables,
                    table,
                    workbookManager,
                    fields: table.fields.filter(a => a.skip == false),
                    datas: table.getDataList(),
                    objects: table.getObjectList(),
                    xxtea: encrypt,
                    inject: injectMap,
                    packagename: packagename,
                    outPath: to,
                    outFilePath: new OutFilePath_1.OutFilePath(to, table.name, "." + tag),
                };
                matchedPlugins.forEach(plugin => {
                    console.log(`>>> - handle sheet <${table.name}> with [${plugin.name}]`);
                    plugin.handleSheet(paras);
                });
            }
        }
        console.log(`> handle sheets done`);
    }
    {
        let tables = workbookManager.dataTables;
        let paras = {
            workbookManager: workbookManager,
            tables,
            xxtea: encrypt,
            inject: injectMap,
            packagename: packagename,
            outPath: to,
        };
        console.log(`> handle batch begin`);
        matchedPlugins.forEach(plugin => {
            console.log(`>> - handle batch with [${plugin.name}]`);
            plugin.handleBatch(paras);
        });
        console.log(`> handle batch done`);
    }
}
exports.handler = handler;
//# sourceMappingURL=export.js.map