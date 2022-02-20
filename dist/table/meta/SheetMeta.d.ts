import { Sheet } from "../Sheet";
import { FieldMeta } from "./FieldMeta";
/**
 * 继承模式
 */
export declare enum SheetExtendMode {
    Sub = "-",
    Add = "+"
}
export declare class SheetMeta {
    /**
     * 源名称
     */
    data: string[];
    name: string;
    workbookName: string;
    sheet: Sheet;
    constructor(
    /**
     * 源名称
     */
    data: string[]);
    exportSheetName?: string;
    extendMode: SheetExtendMode;
    fieldMetas: FieldMeta[];
    addFieldMeta(fieldMeta: FieldMeta): void;
}
