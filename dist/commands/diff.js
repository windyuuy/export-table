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
const fs = require("fs-extra");
const path_1 = require("path");
const ConvertPath_1 = require("../ConvertPath");
const chalk_1 = require("chalk");
const child_process = require("child_process");
exports.command = 'diff <from> <to> <tag> [--ext 包含的文件名]';
exports.describe = '分离当前版本和之前版本之间差异的文件';
function builder(yargs) {
    return yargs
        .string("from")
        .string("to")
        .string("tag")
        .array("exts").default("exts", [".png", ".jpg"])
        .demand(["from", "to", "tag"])
        .help("h");
}
exports.builder = builder;
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let from = ConvertPath_1.convertPath(argv.from).replace(/\\/g, "/");
        let to = ConvertPath_1.convertPath(argv.to);
        let tag = argv.tag;
        let exts = argv.exts;
        try {
            let rootPath = child_process.execSync(`cd ${from}&&git rev-parse --show-toplevel`).toString().replace(/\s/g, "");
            console.log("仓库根目录", rootPath);
            let results = child_process.execSync(`cd ${from}&&git diff ${tag} --name-status`).toString();
            console.log(results);
            let result = results.split(/\s+/g);
            for (let i = 0; i < result.length; i += 2) {
                let change = result[i];
                let file = result[i + 1];
                if (file) {
                    file = path_1.join(rootPath, file).replace(/\\/g, "/");
                    // console.log(file)
                    if (file.startsWith(from) == false || exts.indexOf(path_1.extname(file)) == -1) {
                        continue; //跳过该文件
                    }
                    let savePath = path_1.join(to, path_1.relative(from, file));
                    if (change == "M") {
                        //修改
                        console.log(chalk_1.default.black(chalk_1.default.bgYellow("MODIFY")), chalk_1.default.yellow(file));
                        fs.mkdirpSync(path_1.join(savePath, "../"));
                        fs.copyFileSync(file, savePath);
                    }
                    else if (change == "A") {
                        //添加
                        console.log(chalk_1.default.black(chalk_1.default.bgGreen("ADD")), chalk_1.default.green(file));
                        fs.mkdirpSync(path_1.join(savePath, "../"));
                        fs.copyFileSync(file, savePath);
                    }
                    else if (change == "D") {
                        //删除 因为已经删除，所以不能拷贝 需要打印警告
                        console.warn(chalk_1.default.black(chalk_1.default.bgRed("DELETE")), chalk_1.default.red(file), chalk_1.default.black(chalk_1.default.bgRed("SKIP")));
                    }
                }
            }
        }
        catch (e) {
            if (e.message.indexOf("not a git repository") != -1) {
                console.error(chalk_1.default.red("目录", chalk_1.default.blue(from), "不是一个git仓库"));
            }
            if (e.message.indexOf("ambiguous argument") != -1) {
                console.error(chalk_1.default.red("请检查", chalk_1.default.blue(from), "是否为git仓库，且", chalk_1.default.blue(tag), "是否存在"));
            }
            console.error(chalk_1.default.blue(e.message));
        }
    });
}
exports.handler = handler;
//# sourceMappingURL=diff.js.map