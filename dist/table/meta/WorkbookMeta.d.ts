import { DataTable } from "../DataTable";
import { Workbook } from "../Workbook";
import { SheetMeta } from "./SheetMeta";
/**
 * 继承模式
 */
export declare enum WorkbookExtendMode {
    Sub = "-",
    Add = "+"
}
export declare class WorkbookMeta {
    /**
     * 源名称
     */
    name: string;
    workbook: Workbook;
    data: string[][];
    constructor(
    /**
     * 源名称
     */
    name: string, workbook: Workbook, data: string[][]);
    /**
     * 导出模式
     */
    extendMode: WorkbookExtendMode;
    sheetMetas: SheetMeta[];
    addSheetMeta(sheetMeta: SheetMeta): void;
    getMetaSheetNames(): string[];
    applyMeta(dataTables: DataTable[]): void;
}
