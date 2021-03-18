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
const Sheet_1 = require("../table/Sheet");
const LocalizationTable_1 = require("../table/LocalizationTable");
const Workbook_1 = require("../table/Workbook");
const fs = require("fs");
const path_1 = require("path");
const ConvertPath_1 = require("../ConvertPath");
const chalk_1 = require("chalk");
const LocalScan_1 = require("../LocalScan");
exports.command = 'genccstrings <from> <to>';
exports.describe = '从cocos项目提取语言key并产生多语言表，在界面中将提取ILabel和cc.Label中的key和string属性；在代码中将匹配i18n中的locString、format函数第一个参数作为key，此外还支持添加如下格式注释进行匹配：//STRINGS("key")';
function builder(yargs) {
    return yargs
        .string("from")
        .string("to")
        .string("lang").default("lang", "zh").describe("lang", "当前环境默认的语言")
        .demand(["from", "to"])
        .help("h");
}
exports.builder = builder;
const n = /-/g, s = /^[0-9a-fA-F-]{36}$/, o = /^[0-9a-fA-F]{32}$/, u = /^[0-9a-zA-Z+/]{22,23}$/, a = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/, t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function compressUuid(uuid, l22) {
    if (s.test(uuid))
        uuid = uuid.replace(n, "");
    else if (!o.test(uuid))
        return uuid;
    var r = !0 === l22 ? 2 : 5;
    return compressHex(uuid, r);
}
function compressHex(uuid, type) {
    var i, n = uuid.length;
    i = void 0 !== type ? type : n % 3;
    for (var s = uuid.slice(0, i), o = []; i < n;) {
        var u = parseInt(uuid[i], 16), a = parseInt(uuid[i + 1], 16), c = parseInt(uuid[i + 2], 16);
        o.push(t[u << 2 | a >> 2]),
            o.push(t[(3 & a) << 4 | c]),
            i += 3;
    }
    return s + o.join("");
}
function getFiles(filepath) {
    let infoList = [];
    let read = (fp) => {
        let st = fs.statSync(fp);
        if (st.isDirectory()) {
            let names = fs.readdirSync(fp);
            for (let n of names) {
                read(path_1.join(fp, n));
            }
        }
        else if (st.isFile()) {
            let ext = path_1.extname(fp);
            switch (ext) {
                case ".ts":
                case ".js":
                case ".prefab":
                case ".fire":
                case ".meta":
                    infoList.push({ filepath: fp, ext, name: path_1.basename(fp, ext), content: fs.readFileSync(fp, "utf8") });
            }
        }
    };
    read(filepath);
    return infoList;
}
function findNodeParentPath(root, node) {
    var path = node._name;
    while (node && node._parent) {
        if (node._parent.__id__) {
            node = root[node._parent.__id__];
            if (node && node._name) {
                path = node._name + "/" + path;
            }
        }
        else {
            node = node._parent;
            if (node && node._name) {
                path = node._name + "/" + path;
            }
        }
    }
    return path;
}
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let from = ConvertPath_1.convertPath(argv.from);
        let to = ConvertPath_1.convertPath(argv.to);
        let lang = argv.lang;
        //加载所有文件进行分析
        let files = getFiles(from);
        //查找ILabel ISprite的UUID
        let ilabelUuid = "";
        let ispriteUuid = "";
        let timerLabelUuid = "";
        let uiList = [];
        let scriptList = [];
        for (let file of files) {
            if (file.ext == ".js" || file.ext == ".ts") {
                scriptList.push(file);
            }
            else if (file.ext == ".prefab" || file.ext == ".fire") {
                uiList.push(file);
            }
            else if (file.ext == ".meta" && file.name == "ILabel.ts") {
                ilabelUuid = compressUuid(JSON.parse(file.content).uuid);
            }
            else if (file.ext == ".meta" && file.name == "ISprite.ts") {
                ispriteUuid = compressUuid(JSON.parse(file.content).uuid);
            }
            else if (file.ext == ".meta" && file.name == "TimerLabel.ts") {
                timerLabelUuid = compressUuid(JSON.parse(file.content).uuid);
            }
        }
        console.log("ILabel", ilabelUuid);
        // console.log("ISprite",ispriteUuid)
        //创建新的数据表
        let resultSheet = new Sheet_1.default();
        resultSheet.name = "strings";
        let reusltLocal = new LocalizationTable_1.default(resultSheet);
        //分析ui界面
        let keyDesMap = {};
        for (let file of uiList) {
            let root = JSON.parse(file.content);
            //查找cc.Node 并找出其中组件，如果包含ILabel和Label则产生key和value值
            for (let obj of root) {
                let label;
                let ilabel;
                let richLabel;
                let timerLabel;
                if (obj.__type__ == "cc.Node") {
                    if (obj._components)
                        for (let c of obj._components) {
                            let comp;
                            if (c.__type__) {
                                comp = c;
                            }
                            else if (c.__id__) {
                                comp = root[c.__id__];
                            }
                            if (comp.__type__ == "cc.Label") {
                                label = comp;
                            }
                            else if (comp.__type__ == "cc.RichText") {
                                richLabel = comp;
                            }
                            else if (comp.__type__ == ilabelUuid) {
                                ilabel = comp;
                            }
                            else if (comp.__type__ == timerLabelUuid) {
                                timerLabel = comp;
                            }
                        }
                }
                if (ilabel && (label || richLabel)) {
                    let stringV = label ? (timerLabel ? timerLabel._timeformat : label._string) : richLabel._N$string;
                    keyDesMap[ilabel.key] = (keyDesMap[ilabel.key] || "") + "\n" + file.name + file.ext + ":" + findNodeParentPath(root, obj);
                    if (timerLabel) {
                        reusltLocal.setValue(ilabel.key, lang, stringV);
                    }
                    else {
                        reusltLocal.setValue(ilabel.key, lang, stringV);
                    }
                }
            }
        }
        //分析脚本
        for (let file of scriptList) {
            let resultList = LocalScan_1.default.scan(file.content);
            for (let obj of resultList) {
                if (obj.value) {
                    reusltLocal.setValue(obj.key, lang, obj.value); //覆盖或插入
                }
                else if (!obj.value && reusltLocal.getValue(obj.key, lang) == null) { //由于当前赋值的value是空的，因此 如果已经赋值过一次，则不赋值第二次。防止覆盖旧值
                    reusltLocal.setValue(obj.key, lang, ""); //相当于插入
                }
                keyDesMap[obj.key] = (keyDesMap[obj.key] || "") + "\n" + file.name + file.ext;
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
            let sheet = oldExcel.getSheet("strings");
            if (sheet == null) {
                console.error(chalk_1.default.red("旧的语言表中不包含strings页面"));
                return;
            }
            let oldLocal = new LocalizationTable_1.default(sheet);
            oldLocal.putNewTable(reusltLocal, lang);
            reusltLocal = oldLocal;
            fs.renameSync(to, to.replace(".xlsx", "") + "." + new Date().getTime().toString(36) + ".xlsx");
            resultBook = oldExcel;
        }
        //添加描述
        for (let k in keyDesMap) {
            reusltLocal.setKeyDescribe(k, keyDesMap[k]);
        }
        let saved = resultBook.save();
        fs.writeFileSync(to, saved);
    });
}
exports.handler = handler;
//# sourceMappingURL=genccstrings.js.map