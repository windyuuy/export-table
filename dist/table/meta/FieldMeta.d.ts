import { FiledType } from "../Field";
/**
 * 继承模式
 */
export declare enum FieldExtendMode {
    Sub = "-",
    Add = "+"
}
export declare class FieldMeta {
    /**
     * 源名称
     */
    data: string;
    /**
     * 导出类型
     */
    type?: FiledType;
    /**
     * 导出名称
     */
    exportName?: string;
    /**
     * 继承模式
     */
    extendMode: FieldExtendMode;
    name: string;
    constructor(
    /**
     * 源名称
     */
    data: string);
}
