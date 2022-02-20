import { basename } from "path";
import { Sheet } from "./Sheet";
import * as xlsx from "xlsx-color"
import bufferFrom = require("buffer-from");
import { SheetMeta } from "./meta/SheetMeta";
import { WorkbookMeta } from "./meta/WorkbookMeta";
import { WorkbookMetaManager } from "./meta/WorkbookMetaManager";
import { FieldMeta } from "./meta/FieldMeta";
import chalk from "chalk";


export class Workbook {

    /**
     * 文件路径
     */
    filepath:string="";

    sheets:Sheet[] = [];

    /**
     * 场景管理器
     */
    metaManager: WorkbookMetaManager = new WorkbookMetaManager()

    constructor(){

    }


    /**
     * 根据表格名称获取表格
     * @param name 
     */
    getSheet(name:string){
        return this.sheets.find(a => a.nameOrigin == name);
    }

    /**
     * 保存表格到该工作簿
     * @param name 
     * @param sheet 
     */
    addSheet(sheet:Sheet){
        this.sheets.push(sheet);
    }

    /**
     * 移除表
     * @param sheet 
     */
    removeSheet(sheet:Sheet){
        let index=this.sheets.indexOf(sheet);
        if(index!=-1){
            this.sheets.splice(index,1)
        }
    }

    protected addSceneMeta(sceneMeta: WorkbookMeta) {
        this.metaManager!.addSceneMeta(sceneMeta)
    }

    /**
     * 加载工作簿
     * @param buff 
     */
    load(filepath:string,buff:Buffer){
        this.filepath=filepath;

        const workBook = xlsx.read(buff, {});
        let sheetNames = Object.keys(workBook.Sheets);

        let validSheetNames = sheetNames.filter(sheetName => !sheetName.endsWith(".meta"))
        for (let sheetName of validSheetNames) {
            const sheet = workBook.Sheets[sheetName];
            let s = new Sheet()
            s.workbookName = this.name
            if (sheetName == "Sheet1") {
                s.setupName(this.name)
                s.isDefault = true
            } else {
                s.setupName(sheetName)
            }
            let data=xlsx.utils.sheet_to_json(sheet, {header: 1, raw: true}) as [][];
            for(let rowIndex=0;rowIndex<data.length;rowIndex++){
                let row=data[rowIndex]
                for(let columIndex=0;columIndex<row.length;columIndex++){
                    s.setValue(rowIndex,columIndex,row[columIndex]);

                    let cell=xlsx.utils.encode_cell({c:columIndex , r: rowIndex})
                    if(sheet[cell]&&sheet[cell].c&&sheet[cell].c[0]&&sheet[cell].c[0].t){
                        s.setDescribe(rowIndex,columIndex,sheet[cell].c[0].t)
                        // console.log(cell,sheet[cell].c[0].t)
                    }
                }
            }
            this.addSheet(s);
        }

        let metaSheets = sheetNames.filter(sheetName => sheetName.endsWith(".meta"))
        if (metaSheets.length > 0) {
            for (let metaSheetName of metaSheets) {
                const metaSheet = workBook.Sheets[metaSheetName];
                let data0 = xlsx.utils.sheet_to_json(metaSheet, { header: 1, raw: true }) as [][];
                let data: string[][] = []
                if (data0.length >= 1) {
                    for (let i = 0; i < data0[0].length; i++) {
                        data[i] = []
                    }
                }
                for (let i = 0; i < data0.length; i++) {
                    let row0 = data0[i]
                    for (let j = 0; j < row0.length; j++) {
                        data[j][i] = row0[j]
                    }
                }

                let m = metaSheetName.match(/(.+)\.meta/)!
                let sceneMetaName = m[1]
                let sceneMeta = new WorkbookMeta(sceneMetaName, this, data)
                this.addSceneMeta(sceneMeta);
                for (let isheet = 0; isheet < data.length; isheet++) {
                    let sheetMetaData = data[isheet]
                    let sheetMeta = new SheetMeta(sheetMetaData)
                    sheetMeta.workbookName = this.name
                    sceneMeta.addSheetMeta(sheetMeta)
                    let sheet = this.getSheet(sheetMeta.name)
                    if (sheet == null) {
                        let tip = `invalid sheet name in meta: ${sheetMeta.name}`
                        console.error(chalk.red(tip))
                        throw new Error(tip)
                    }
                    sheetMeta.sheet = sheet

                    let fieldMetaDatas = sheetMetaData.filter(d => !d.startsWith("#"))
                    for (let ifield = 0; ifield < fieldMetaDatas.length; ifield++) {
                        let fieldMetaData = fieldMetaDatas[ifield] as string
                        let fieldMeta = new FieldMeta(fieldMetaData)
                        sheetMeta.addFieldMeta(fieldMeta)
                    }
                }
            }
        }
    }

    /**
     * 保存工作布
     */
    save():Buffer{
        const defaults:any = {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary',
            cellStyles:true
        };

        let workBook:any={
            SheetNames:[],
            Sheets:{}
        }
        for(let sheet of this.sheets){
            workBook.SheetNames.push(sheet.nameOrigin);
            workBook.Sheets[sheet.nameOrigin] = sheet.xlsxData;
        }

        const excelData = xlsx.write(workBook, defaults);
        return bufferFrom(excelData,"binary");
    }

    /**
     * 文件名，包含扩展名
     */
    get filename(){

        return basename(this.filepath);
    }

    /**
     * 工作簿名称，不包含扩展名
     */
    get name(){
        return basename(this.filepath,".xlsx");
    }
}