import { Cell } from "./Cell";

import * as xlsx from "xlsx-color"
import { SheetMeta } from "./meta/SheetMeta";

const isBoolean = (maybeBoolean:any) => typeof maybeBoolean === 'boolean';
const isNumber = (maybeNumber:any) => typeof maybeNumber === 'number';
const isString = (maybeString:any) => typeof maybeString === 'string';
const isObject = (maybeObject:any) => maybeObject !== null && typeof maybeObject === 'object';
const isCellDescriptor = (maybeCell:any) => isObject(maybeCell) && 'v' in maybeCell;

const originDate = new Date(Date.UTC(1899, 11, 30)) as any;

const buildExcelDate = (value:any, is1904?:boolean) => {
  const epoch:any = Date.parse((value + (is1904 ? 1462 : 0)) as any);
  return (epoch - originDate) / (864e5);
};


export class Sheet {
    constructor() {

    }

    applyMeta(meta: SheetMeta) {
        if (meta.exportSheetName) {
            this.name = meta.exportSheetName
        }
    }
    name: string = "Sheet1"
    nameOrigin: string = "Sheet1"
    isDefault = false
    workbookName!: string
    setupName(name: string) {
        this.nameOrigin = name
        this.name = name
    }
    data: Cell[][] = [];

    get fullName() {
        if (this.isDefault) {
            return this.name
        } else {
            return `${this.workbookName}-${this.name}`
        }
    }

    get rowLength(){
        return this.data.length;
    }

    get columnLength(){
        let max=0;
        for(let list of this.data){
            max=Math.max(max,list.length)
        }
        return max;
    }

    /**
     * 获取某一行的所有单元
     * 如果该行不存在，则返回空
     * @param index 
     */
    getRow(index:number){
        let row=this.data[index]
        if(row){
            return this.data[index].concat();
        }else{
            return null;
        }
    }

    /**
     * 获取某一行的数据
     * @param index 
     */
    getRowValue(index:number){
        let row=this.getRow(index);
        if(row){
            return row.map(a=>a?a.value:null)
        }else{
            return null;
        }
    }

    /**
     * 获取某一列的所有单元
     * 如果该列不存在，则返回空
     * @param index 
     */
    getColumn(index:number){
        if(index<0)return null;
        let colum=[];
        for(let r=0;r<this.data.length;r++){
            let row=this.data[r];
            if(row.length>index){
                colum[r]=row[index];
            }
        }
        if(colum.length==0){
            return null;
        }
        return colum;
    }

    /**
     * 获取某一列的数据
     * @param index 
     */
    getColumValue(index:number){
        let colum=this.getColumn(index);
        if(colum){
            return colum.map(a=>a?a.value:null)
        }else{
            return null;
        }
    }

    /**
     * 获取单元行数据
     * @param row 行编号
     * @param colum 列编号
     */
    getValue(row:number,colum:number){
        let r=this.data[row];
        let c=null;
        if(r){
            c=r[colum];
        }
        return c&&c.value;
    }

    /**
     * 设置单元数据
     * @param row 行编号
     * @param colum 列编号
     */
    setValue(row:number,colum:number,value:any){
        let r=this.data[row];
        if(r==null){
            r=this.data[row]=[];//创建新的行
        }
        let c=r[colum];
        if(c==null){
            c=r[colum]=new Cell;//创建新的单元
        }
        c.value=value;
    }

    setColor(row:number,colum:number,color:string){
        let r=this.data[row];
        if(r==null){
            r=this.data[row]=[];//创建新的行
        }
        let c=r[colum];
        if(c==null){
            c=r[colum]=new Cell;//创建新的单元
        }
        c.color=color;
    }

    setBackground(row:number,colum:number,color:string){
        let r=this.data[row];
        if(r==null){
            r=this.data[row]=[];//创建新的行
        }
        let c=r[colum];
        if(c==null){
            c=r[colum]=new Cell;//创建新的单元
        }
        c.background=color;
    }

    setDescribe(row:number,colum:number,describe:string){
        let r=this.data[row];
        if(r==null){
            r=this.data[row]=[];//创建新的行
        }
        let c=r[colum];
        if(c==null){
            c=r[colum]=new Cell;//创建新的单元
        }
        c.describe=describe;
    }

    get xlsxData(){
        const workSheet:any = {};
        const range = {s: {c: 1e7, r: 1e7}, e: {c: 0, r: 0}};

        for (let R = 0; R !== this.data.length; R += 1) {
          for (let C = 0; C !== this.data[R].length; C += 1) {
      
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;

            if (this.data[R][C] == null) {
              continue; // eslint-disable-line
            }

            let c=this.data[R][C];
            if(c.value==undefined){
                continue;
            }
            const cell:any = {v: c.value};
            const cellRef = xlsx.utils.encode_cell({c: C, r: R});
            if (isNumber(cell.v)) {
              cell.t = 'n';
            } else if (isBoolean(cell.v)) {
              cell.t = 'b';
            } else if (cell.v instanceof Date) {
              cell.t = 'n';
              cell.v = buildExcelDate(cell.v);
              cell.z = cell.z || (xlsx.SSF as any)._table[14]; // eslint-disable-line no-underscore-dangle
      
            /* eslint-disable spaced-comment, no-trailing-spaces */
            /***
             * Allows for an non-abstracted representation of the data
             * 
             * example: {t:'n', z:10, f:'=AVERAGE(A:A)'}
             * 
             * Documentation:
             * - Cell Object: https://sheetjs.gitbooks.io/docs/#cell-object
             * - Data Types: https://sheetjs.gitbooks.io/docs/#data-types
             * - Format: https://sheetjs.gitbooks.io/docs/#number-formats
             **/
            /* eslint-disable spaced-comment, no-trailing-spaces */
            } else if (isObject(cell.v)) {
              cell.t = cell.v.t;
              cell.f = cell.v.f;
              cell.z = cell.v.z;
            } else {
              cell.t = 's';
            }
            if (isNumber(cell.z)) cell.z = (xlsx.SSF as any)._table[cell.z]; // eslint-disable-line no-underscore-dangle

            //教程 https://www.jianshu.com/p/50d3bc9813e3
            if(c.background){
                cell.s=cell.s||{}
                cell.s.fill= {
                    fgColor: { rgb: c.background }
                }
            }
            if(c.color){
                cell.s=cell.s||{}
                cell.s.font={
                    color:{rgb:c.color}
                }
            }
            if(c.describe){
                if(!cell.c)cell.c=[];
                cell.c.push({a:"glee",t:c.describe});
                cell.c.hidden=true
            }

            workSheet[cellRef] = cell;
          }
        }
        if (range.s.c < 1e7) {
          workSheet['!ref'] = xlsx.utils.encode_range(range);
        }
        // if (options['!cols']) {
        //   workSheet['!cols'] = options['!cols'];
        // }
        // if (options['!merges']) {
        //   workSheet['!merges'] = options['!merges'];
        // }
        return workSheet;
    }
}