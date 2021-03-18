#!/usr/bin/env node

import * as yargs from "yargs"

import * as exportCmd from "./commands/export"
import * as exportCmd2 from "./commands/export2"
import * as genlocalCmd from "./commands/genlocal"
import * as splitlocalCmd from "./commands/splitlocal"
import * as genccstringsCmd from "./commands/genccstrings"
import * as diffCmd from "./commands/diff"
import { tokitHelper } from "./tokithelper";

if (tokitHelper.launchOptions) {
	const curdir = `${tokitHelper.projectDir}`
	const argv = tokitHelper.convToYargs(tokitHelper.launchOptions)
    
    let cmd=process.argv[2]
    if(cmd=="export1"){
        argv.alls=argv.alls.split(" ")
        argv.allnames=argv.allnames.split(" ")
        argv.inject=argv.inject.split(" ")
        exportCmd.handler(argv);
    }else if(cmd=="export"){
        argv.alls=argv.alls.split(" ")
        argv.allnames=argv.allnames.split(" ")
        argv.inject=argv.inject.split(" ")
        exportCmd2.handler(argv);
    }else if(cmd=="genlocal"){
        genlocalCmd.handler(argv);
    }else if(cmd=="splitlocal"){
        splitlocalCmd.handler(argv);
    }else if(cmd=="genccstrings"){
        genccstringsCmd.handler(argv);
    }else if(cmd=="diff"){
        diffCmd.handler(argv);
    }
}else{
    yargs
    .command(exportCmd)
    .command(exportCmd2)
    .command(genlocalCmd)
    .command(splitlocalCmd)
    .command(genccstringsCmd)
    .command(diffCmd)
    .help("h").argv;

}