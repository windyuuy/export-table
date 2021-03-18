import Sheet from "../table/Sheet";
import LocalizationTable from "../table/LocalizationTable";
import WorkbookManager from "../table/WorkbookManager";
import Workbook from "../table/Workbook";
import * as fs from "fs"
import { convertPath } from "../ConvertPath";
import chalk from "chalk";

export var command = 'genlocal <from> <to>'
 
export var describe = '从目标表中提取指定的多语言数据，产生/合并新的语言表' 
 
export function builder(yargs:typeof import("yargs")) {
    return yargs
    .string("from")
    .string("to")
    .string("lang").default("lang","zh").describe("lang","当前表格默认的语言")
    .demand(["from","to"])
    .help("h")
}
 
export async function handler(argv:any) {
    let from=convertPath(argv.from as string);
    let to=convertPath(argv.to as string);
    let lang=argv.lang as string;

    //创建新的数据表
    let resultSheet=new Sheet();
    resultSheet.name="localization"
    let reusltLocal=new LocalizationTable(resultSheet);

    let workbookManager=new WorkbookManager();
    await workbookManager.build(from);//加载所有表
    let tables=workbookManager.dataTables;
    for(let table of tables){
        let fields=table.fields;
        if(!fields){
            continue;
        }

        let uidFiled=fields.find(a=>a.type=="uid");
        if(uidFiled==null){
            console.error(chalk.red(table.name,"没有唯一key 无法自动生成key"));
            continue;
        }

        let objList=table.getObjectList();
        for(let f of fields){
            if(f.translate){
                for(let o of objList){
                    let value=o[f.name]
                    if(value==null || value.trim()==""){
                        console.error(chalk.red(table.name,o[uidFiled.name],"值为空 跳过"));
                        continue;
                    }
                    reusltLocal.setValue(table.name+"/"+o[uidFiled.name]+"/"+f.name,lang,o[f.name])
                }
            }
        }
    }
    //导出表
    let resultBook=new Workbook();
    resultBook.filepath=to;
    resultBook.addSheet(resultSheet);

    //打开旧的表进行对比
    if(fs.existsSync(to)){
        let oldExcel=new Workbook()
        oldExcel.load(to,fs.readFileSync(to));
        let sheet=oldExcel.getSheet("localization");
        if(sheet==null){
            console.error(chalk.red("旧的语言表中不包含localization页面"))
            return;
        }
        let oldLocal=new LocalizationTable(sheet);
        oldLocal.putNewTable(reusltLocal,lang)
        fs.renameSync(to,to.replace(".xlsx","")+"."+new Date().getTime().toString(36)+".xlsx")
        resultBook=oldExcel
    
    }

    let saved=resultBook.save();

    fs.writeFileSync(to,saved);
    
}  
