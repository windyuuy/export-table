import { Workbook } from "./Workbook";
import { DataTable } from "./DataTable";
export declare class WorkbookManager {
    protected _list: Workbook[];
    protected _tables: DataTable[] | null;
    constructor();
    build(buildPath: string): Promise<void>;
    protected buildExcel(excel: string): Promise<void>;
    /**
     * 获取工作簿列表
     */
    get workbooks(): Workbook[];
    /**
     * 获取数据列表
     */
    get dataTables(): DataTable[];
    /**
     * 获取表名
     * @param name
     */
    getTableByName(name: string): DataTable | undefined;
    /**
     * 检查所有表的错误
     */
    checkError(): void;
}
