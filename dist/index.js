#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const exportCmd = require("./commands/export");
const tokithelper_1 = require("./tokithelper");
__exportStar(require("./table/Cell"), exports);
__exportStar(require("./table/DataTable"), exports);
__exportStar(require("./table/Sheet"), exports);
__exportStar(require("./table/Workbook"), exports);
__exportStar(require("./table/WorkbookManager"), exports);
__exportStar(require("./iplugin/IPlugin"), exports);
if (tokithelper_1.tokitHelper.launchOptions) {
    const curdir = `${tokithelper_1.tokitHelper.projectDir}`;
    const argv = tokithelper_1.tokitHelper.convToYargs(tokithelper_1.tokitHelper.launchOptions);
    let cmd = process.argv[2];
    if (cmd == "export") {
        argv.alls = argv.alls.split(" ");
        argv.allnames = argv.allnames.split(" ");
        argv.inject = argv.inject.split(" ");
        exportCmd.handler(argv);
    }
}
else {
    yargs
        .command(exportCmd)
        .help("h").argv;
}
//# sourceMappingURL=index.js.map