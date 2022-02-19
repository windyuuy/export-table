import { DataTable, WorkbookManager } from "..";
export declare type HandleBatchParams = {
    workbookManager: WorkbookManager;
    tables: DataTable[];
    xxtea: (str: string, key: string, deflate: boolean) => string;
    inject: {
        [key: string]: boolean;
    };
    packagename: string | undefined;
    outPath: string;
};
