
import * as yargs from "yargs"
import * as exportCmd from "./commands/export"
import { tokitHelper } from "./tokithelper";

if (tokitHelper.launchOptions) {
	const curdir = `${tokitHelper.projectDir}`
	const argv = tokitHelper.convToYargs(tokitHelper.launchOptions)

	let cmd = process.argv[2]
	if (cmd == "export") {
		argv.alls = argv.alls.split(" ")
		argv.allnames = argv.allnames.split(" ")
		argv.inject = argv.inject.split(" ")
		exportCmd.handler(argv);
	}
} else {
	yargs
		.command(exportCmd)
		.help("h").argv;

}
