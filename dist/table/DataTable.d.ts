import Sheet from "./Sheet";
import WorkbookManager from "./WorkbookManager";
import Cell from "./Cell";
declare type FiledType = "any" | "uid" | "number" | "number[]" | "bool" | "bool[]" | "string" | "object" | "object[]" | "fk" | "string*" | "string[]" | "key" | "fk[]";
export declare class Field {
    /**
     * 是否跳过该字段
     */
    skip: boolean;
    name: string;
    describe: string;
    type: FiledType;
    fkTableName: string | undefined;
    fkFieldName: string | undefined;
    translate: boolean;
    constructor(name: string, describe: string, type: FiledType);
}
/**
 * 专门处理普通数据表,可设定字段类型，添加移除对象等功能
 */
export default class DataTable {
    /**
     * 当前操作的数据页
     */
    sheet: Sheet;
    /**
     * 表名
     */
    name: string;
    manager: WorkbookManager | null;
    constructor(
    /**
     * 当前操作的数据页
     */
    sheet: Sheet, 
    /**
     * 表名
     */
    name: string);
    isNullCell(cell: Cell | null): boolean;
    /**
     * 获取当前表中的字段列表
     */
    get fields(): Field[] | null;
    protected getNewData(field: Field, data: any, lineNumber: number): any;
    /**
     * 获取所有的数据列表
     */
    getDataList(): any[][];
    /**
     * 获取经过转换的对象
     */
    getObjectList(): any[];
    /**
     * 检查表格格式是否错误
    */
    checkError(): void;
    /**
     * 获取指定字段的值列表
     * @param fieldName 字段名称
     */
    getFieldValueList(fieldName: string): any[];
}
export {};
