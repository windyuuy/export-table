import LocalizationTable from "../table/LocalizationTable";
import Workbook from "../table/Workbook";
import * as fs from "fs-extra"
import RazorGenerator from "../RazorGenerator";
import { join, relative, extname } from "path";
import { convertPath } from "../ConvertPath";
import chalk from "chalk";
import * as child_process from "child_process"

export var command = 'diff <from> <to> <tag> [--ext 包含的文件名]' 
 
export var describe = '分离当前版本和之前版本之间差异的文件' 
 
export function builder(yargs:typeof import("yargs")) {
    return yargs
    .string("from")
    .string("to")
    .string("tag")
    .array("exts").default("exts",[".png",".jpg"])
    .demand(["from","to","tag"])
    .help("h")
}
 
export async function handler(argv:any) {
    let from=convertPath(argv.from as string).replace(/\\/g,"/");
    let to=convertPath(argv.to as string);
    let tag=argv.tag as string;
    let exts=argv.exts as string[];

    try{

        let rootPath=child_process.execSync(`cd ${from}&&git rev-parse --show-toplevel`).toString().replace(/\s/g,"")
        console.log("仓库根目录",rootPath);

        let results=child_process.execSync(`cd ${from}&&git diff ${tag} --name-status`).toString();
        console.log(results)
        let result= results.split(/\s+/g)
        for(let i=0;i<result.length;i+=2){
            let change=result[i]
            let file=result[i+1]
            if(file){
                file=join(rootPath,file).replace(/\\/g,"/");
                // console.log(file)
                if(file.startsWith(from)==false || exts.indexOf(extname(file))==-1){
                    continue;//跳过该文件
                }
                let savePath=join(to,relative(from,file))
                if(change=="M"){
                    //修改
                    console.log(chalk.black(chalk.bgYellow("MODIFY")),chalk.yellow(file))
                    fs.mkdirpSync(join(savePath,"../"))
                    fs.copyFileSync(file,savePath)
                }else if(change=="A"){
                    //添加
                    console.log(chalk.black(chalk.bgGreen("ADD")),chalk.green(file))
                    fs.mkdirpSync(join(savePath,"../"))
                    fs.copyFileSync(file,savePath)
                }else if(change=="D"){
                    //删除 因为已经删除，所以不能拷贝 需要打印警告
                    console.warn(chalk.black(chalk.bgRed("DELETE")),chalk.red(file),chalk.black(chalk.bgRed("SKIP")))
                }
            }
        }
    }catch(e){
        if(e.message.indexOf("not a git repository")!=-1){
            console.error(chalk.red("目录",chalk.blue(from),"不是一个git仓库"))
        }
        if(e.message.indexOf("ambiguous argument")!=-1){
            console.error(chalk.red("请检查",chalk.blue(from),"是否为git仓库，且",chalk.blue(tag),"是否存在"))
        }
        console.error(chalk.blue(e.message))
    }

    
}  
