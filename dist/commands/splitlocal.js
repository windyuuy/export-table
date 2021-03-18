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
const LocalizationTable_1 = require("../table/LocalizationTable");
const Workbook_1 = require("../table/Workbook");
const fs = require("fs");
const RazorGenerator_1 = require("../RazorGenerator");
const path_1 = require("path");
const ConvertPath_1 = require("../ConvertPath");
const chalk_1 = require("chalk");
exports.command = 'splitlocal <from> <to>';
exports.describe = '分割语言文件，使用模板产生最终项目使用的语言数据';
function builder(yargs) {
    return yargs
        .string("from")
        .string("to")
        .string("template").alias("t", "template").describe("t", "razor格式的js模板，属性说明:data为keyvalue形式的语言对应表；lang为当前语言名称；")
        .string("name").alias("n", "name").describe("n", "导出文件的文件名，将自动将lang替换为当前的语言值，例如local_lang.json")
        .demand(["from", "to", "template", "name"])
        .help("h");
}
exports.builder = builder;
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let from = ConvertPath_1.convertPath(argv.from);
        let to = ConvertPath_1.convertPath(argv.to);
        let template = ConvertPath_1.convertPath(argv.template);
        let name = argv.name;
        var templatePath = path_1.join(__dirname, "../../template");
        console.log(chalk_1.default.green("{template} = " + templatePath));
        if (template && template.startsWith("{template}")) {
            template = template.replace("{template}", templatePath);
        }
        let book = new Workbook_1.default();
        book.load(from, fs.readFileSync(from));
        let sheet = book.getSheet("localization") || book.getSheet("strings");
        if (!sheet) {
            console.error(chalk_1.default.red("无法找到 localization 或 strings 页面"));
            return;
        }
        //每个语言产生一份数据
        let tempSrc = fs.readFileSync(template, "utf-8");
        let tempScript = RazorGenerator_1.default.instance.converToCode(tempSrc);
        let local = new LocalizationTable_1.default(sheet);
        let langs = local.languages;
        console.log(chalk_1.default.bgBlue("发现语言"), langs);
        for (let lang of langs) {
            let data = local.extractLangeData(lang);
            let expName = name.replace("lang", lang);
            let result = RazorGenerator_1.default.instance.runTemp(tempScript, { data, lang });
            if (result == null) {
                return;
            }
            console.log("导出", path_1.join(to, expName));
            fs.writeFileSync(path_1.join(to, expName), result);
        }
    });
}
exports.handler = handler;
//# sourceMappingURL=splitlocal.js.map