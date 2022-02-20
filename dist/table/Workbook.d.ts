/// <reference types="node" />
import { Sheet } from "./Sheet";
import { WorkbookMeta } from "./meta/WorkbookMeta";
import { WorkbookMetaManager } from "./meta/WorkbookMetaManager";
export declare class Workbook {
    /**
     * 文件路径
     */
    filepath: string;
    sheets: Sheet[];
    /**
     * 场景管理器
     */
    metaManager: WorkbookMetaManager;
    constructor();
    /**
     * 根据表格名称获取表格
     * @param name
     */
    getSheet(name: string): Sheet | undefined;
    /**
     * 保存表格到该工作簿
     * @param name
     * @param sheet
     */
    addSheet(sheet: Sheet): void;
    /**
     * 移除表
     * @param sheet
     */
    removeSheet(sheet: Sheet): void;
    protected addSceneMeta(sceneMeta: WorkbookMeta): void;
    /**
     * 加载工作簿
     * @param buff
     */
    load(filepath: string, buff: Buffer): void;
    /**
     * 保存工作布
     */
    save(): Buffer;
    /**
     * 文件名，包含扩展名
     */
    get filename(): string;
    /**
     * 工作簿名称，不包含扩展名
     */
    get name(): string;
}
