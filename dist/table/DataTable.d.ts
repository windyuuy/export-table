import { Sheet } from "./Sheet";
import { WorkbookManager } from "./WorkbookManager";
import { Cell } from "./Cell";
import { Field } from "./Field";
/**
 * 专门处理普通数据表,可设定字段类型，添加移除对象等功能
 */
export declare class DataTable {
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
    protected getFields(): Field[] | null;
    protected _fields: Field[] | null;
    /**
     * 获取当前表中的字段列表
     */
    get fields(): Field[] | null;
    protected getNewData(field: Field, data: any, lineNumber: number): any;
    protected _dataList: any[][] | undefined;
    get dataList(): any[][];
    /**
     * 获取所有的数据列表
     */
    getDataList(): any[][];
    convDataToObject(data: any[], fieldList: Field[]): any;
    /**
     * 获取经过转换的对象
     */
    getObjectList(): any[];
    getRowData(key: any, field: Field): any[] | undefined;
    getField(name: string): Field | undefined;
    getFKObject<T = any>(fkRefer: any, field: Field): T | undefined;
    getFKData<T = any[]>(fkRefer: any, field: Field): T | undefined;
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
