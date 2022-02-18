import { WorkbookManager } from "../table/WorkbookManager";
import * as  xxtea from 'xxtea-node';
import * as pako from "pako"
import * as fs from "fs"
import { join } from "path";
import { IPlugin } from "../iplugin/IPlugin";

export var command = 'export <from> <to>'
 
export var describe = '导出表格，可以每张表格单独导出，或是全部数据一起导出。' 
 
export function builder(yargs:typeof import("yargs")) {
    return yargs
    .string("from")
    .string("to")
    .string("one").describe("one","导出单张表格的模板")
    .string("onename").describe("one","名称模板，会自动替换name为表名")
    .array("alls").describe("alls","导出所有数据的模板 可以为多个")
    .array("allnames").describe("allnames","导出所有数据的文件名 数量必须和alls匹配")
    .array("inject").describe("inject","注入到模板中的boolean形变量，可以间接控制模板功能")
    .string("packagename").describe("packagename","包名称")
    .boolean("tableNameFirstLetterUpper").describe("tableNameFirstLetterUpper","talbe首字母大写")
    .demand(["from","to"])
    .help("h")
}

function encrypt(str:string,key:string,deflate:boolean){
    //先压缩再加密
    if(deflate){
        let deflateValue= pako.deflate(str);
        return xxtea.encryptToString(deflateValue,key);    
    }else{
        return xxtea.encryptToString(str,key);
    }
}

function clearSpace(value:string){
    return value.replace(/^(\r|\n|\t| )+$/gm,"");
}
function firstLetterUpper(str:string){
    return str.charAt(0).toUpperCase()+str.slice(1);
};

export async function handler(argv: any) {
    let from: string = argv.from;
    let to: string = argv.to;
    let one: string | undefined = argv.one;
    let onename: string = argv.onename;
    let alls: string[] = argv.alls || [];
    let allnames: string[] = argv.allnames || [];
    let inject: string[] = argv.inject || [];
    let packagename: string | undefined = argv.packagename;
    let tableNameFirstLetterUpper: boolean | false = argv.tableNameFirstLetterUpper;

    let injectMap: { [key: string]: boolean } = {}
    for (let k of inject) {
        injectMap[k] = true;
    }

    if (onename==null){
        onename=`name.${one}`
    }

    //加载所有表格数据
    let workbookManager = new WorkbookManager();
    await workbookManager.build(from);//加载所有表
    workbookManager.checkError();

    {
        //导出每张表
        for (let table of workbookManager.dataTables) {
            if (tableNameFirstLetterUpper) {
                table.name = firstLetterUpper(table.name);
            }
            console.log(table.name)
            let paras = {
                name: table.name,
                tables: workbookManager.dataTables,
                fields: table.fields!.filter(a => a.skip == false),
                datas: table.getDataList(),
                objects: table.getObjectList(),
                xxtea: encrypt,
                inject: injectMap,
                packagename: packagename
            }
            // console.log(paras.datas)
            let ps = one!.split(":")
            let cmd = ps[1]
            let plugin = ps[0]
            var ExportPlugin: (new () => IPlugin) | undefined
            try {
                ExportPlugin = require("export-table-pulgin-" + plugin).ExportPlugin as new () => IPlugin
            } catch {
                console.error(`plugin not found: <${plugin}>`)
            }
            if (ExportPlugin != undefined) {
                const plugin = new ExportPlugin()
                if (typeof ((plugin as any)[cmd]) == "function") {
                    let result = (plugin as any)[cmd](paras)
                    if (result != null) {
                        fs.writeFileSync(join(to, onename.replace("name", table.name)), clearSpace(result));
                    }
                    return;
                } else {
                    console.error(`cmd not found: <${cmd}>`)
                }
            }
            // console.log(join(to,onename.replace("name",table.name)));
        }
    }

}