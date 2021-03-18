import * as fs from "fs"
import * as path from "path"
import Workbook from "./Workbook";
import DataTable from "./DataTable";
import chalk from "chalk";
export default class WorkbookManager{

    protected _list:Workbook[]=[];
    protected _tables:DataTable[]|null=null;

    constructor(){
    }

    async build(buildPath:string){
        
        let buildPromiseList:Promise<void>[]=[];

        let list=fs.readdirSync(buildPath);
        for(let i=0;i<list.length;i++){
            let p=list[i];
            //点开头的为隐藏文件
            if(path.basename(p)[0]=="." || path.basename(p)[0]=="~"){
                continue;
            }
            let state=fs.statSync(path.join(buildPath,p))
            if(state.isDirectory()){
                //继续向子目录查找
                buildPromiseList.push(this.build(path.join(buildPath,p)))
            }else if(path.extname(p)==".xlsx"){
                //找到xls文件
                buildPromiseList.push(this.buildExcel(path.join(buildPath,p)));
            }
        }

        for(let i=0;i<buildPromiseList.length;i++){
            await buildPromiseList[i];
        }
    }

    protected async buildExcel(excel:string){
        var promise=new Promise<void>((resolve, reject)=>{

            fs.readFile(excel,(err,buffer)=>{
                if(err){
                    console.error(chalk.red(String(err)))
                    resolve();
                    return;
                }
                let workbook=new Workbook()
                workbook.load(excel,buffer)
                this._list.push(workbook);
                resolve();
            });

        });
        return promise;
    }

    /**
     * 获取工作簿列表
     */
    get workbooks():Workbook[]{
        return this._list.concat();
    }

    /**
     * 获取数据列表
     */
    get dataTables():DataTable[]{
        if(this._tables==null){
            this._tables=[];
            for(let b of this._list){
                let sheet=b.sheets[0]
                if(sheet && sheet.data.length>=3){
                    let datatable=new DataTable(sheet,b.name);
                    datatable.manager=this;
                    this._tables.push(datatable);
                }
            }
    
        }
        return this._tables;
    }

    /**
     * 获取表名
     * @param name 
     */
    getTableByName(name:string){
        return this.dataTables.find(a=>a.name==name)
    }

    /**
     * 检查所有表的错误
     */
    checkError(){
        this.dataTables.forEach(a=>a.checkError());
    }

}