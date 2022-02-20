import { Cell } from "./Cell";
import { SheetMeta } from "./meta/SheetMeta";
export declare class Sheet {
    constructor();
    applyMeta(meta: SheetMeta): void;
    name: string;
    nameOrigin: string;
    isDefault: boolean;
    workbookName: string;
    setupName(name: string): void;
    data: Cell[][];
    get fullName(): string;
    get rowLength(): number;
    get columnLength(): number;
    /**
     * 获取某一行的所有单元
     * 如果该行不存在，则返回空
     * @param index
     */
    getRow(index: number): Cell[] | null;
    /**
     * 获取某一行的数据
     * @param index
     */
    getRowValue(index: number): (string | number | Date | null)[] | null;
    /**
     * 获取某一列的所有单元
     * 如果该列不存在，则返回空
     * @param index
     */
    getColumn(index: number): Cell[] | null;
    /**
     * 获取某一列的数据
     * @param index
     */
    getColumValue(index: number): (string | number | Date | null)[] | null;
    /**
     * 获取单元行数据
     * @param row 行编号
     * @param colum 列编号
     */
    getValue(row: number, colum: number): string | number | Date | null;
    /**
     * 设置单元数据
     * @param row 行编号
     * @param colum 列编号
     */
    setValue(row: number, colum: number, value: any): void;
    setColor(row: number, colum: number, color: string): void;
    setBackground(row: number, colum: number, color: string): void;
    setDescribe(row: number, colum: number, describe: string): void;
    get xlsxData(): any;
}
