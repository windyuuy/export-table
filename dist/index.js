#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const exportCmd = require("./commands/export");
const exportCmd2 = require("./commands/export2");
const genlocalCmd = require("./commands/genlocal");
const splitlocalCmd = require("./commands/splitlocal");
const genccstringsCmd = require("./commands/genccstrings");
const diffCmd = require("./commands/diff");
const tokithelper_1 = require("./tokithelper");
if (tokithelper_1.tokitHelper.launchOptions) {
    const curdir = `${tokithelper_1.tokitHelper.projectDir}`;
    const argv = tokithelper_1.tokitHelper.convToYargs(tokithelper_1.tokitHelper.launchOptions);
    let cmd = process.argv[2];
    if (cmd == "export1") {
        argv.alls = argv.alls.split(" ");
        argv.allnames = argv.allnames.split(" ");
        argv.inject = argv.inject.split(" ");
        exportCmd.handler(argv);
    }
    else if (cmd == "export") {
        argv.alls = argv.alls.split(" ");
        argv.allnames = argv.allnames.split(" ");
        argv.inject = argv.inject.split(" ");
        exportCmd2.handler(argv);
    }
    else if (cmd == "genlocal") {
        genlocalCmd.handler(argv);
    }
    else if (cmd == "splitlocal") {
        splitlocalCmd.handler(argv);
    }
    else if (cmd == "genccstrings") {
        genccstringsCmd.handler(argv);
    }
    else if (cmd == "diff") {
        diffCmd.handler(argv);
    }
}
else {
    yargs
        .command(exportCmd)
        .command(exportCmd2)
        .command(genlocalCmd)
        .command(splitlocalCmd)
        .command(genccstringsCmd)
        .command(diffCmd)
        .help("h").argv;
}
//# sourceMappingURL=index.js.map