import LocalizationTable from "../table/LocalizationTable";
import Workbook from "../table/Workbook";
import * as fs from "fs"
import RazorGenerator from "../RazorGenerator";
import { join } from "path";
import { convertPath } from "../ConvertPath";
import chalk from "chalk";

export var command = 'splitlocal <from> <to>' 
 
export var describe = '分割语言文件，使用模板产生最终项目使用的语言数据' 
 
export function builder(yargs:typeof import("yargs")) {
    return yargs
    .string("from")
    .string("to")
    .string("template").alias("t","template").describe("t","razor格式的js模板，属性说明:data为keyvalue形式的语言对应表；lang为当前语言名称；")
    .string("name").alias("n","name").describe("n","导出文件的文件名，将自动将lang替换为当前的语言值，例如local_lang.json")
    .demand(["from","to","template","name"])
    .help("h")
}
 
export async function handler(argv:any) {
    let from=convertPath(argv.from as string);
    let to=convertPath(argv.to as string);
    let template=convertPath(argv.template as string);
    let name=argv.name as string

    var templatePath=join(__dirname,"../../template")
    console.log(chalk.green("{template} = "+templatePath));
    if(template && template.startsWith("{template}")){
        template=template.replace("{template}",templatePath);
    }

    let book=new Workbook()
    book.load(from,fs.readFileSync(from));
    let sheet=book.getSheet("localization") || book.getSheet("strings");

    if(!sheet){
        console.error(chalk.red("无法找到 localization 或 strings 页面"))
        return;
    }

    //每个语言产生一份数据
    let tempSrc=fs.readFileSync(template,"utf-8")
    let tempScript= RazorGenerator.instance.converToCode(tempSrc);
    
    let local=new LocalizationTable(sheet);
    let langs=local.languages;
    console.log(chalk.bgBlue("发现语言"),langs)
    for(let lang of langs){
        let data= local.extractLangeData(lang);
        let expName=name.replace("lang",lang)
        let result=RazorGenerator.instance.runTemp(tempScript,{data,lang})
        if(result==null){
            return;
        }
        console.log("导出",join(to,expName))
        fs.writeFileSync(join(to,expName),result)
    }
    
}  
