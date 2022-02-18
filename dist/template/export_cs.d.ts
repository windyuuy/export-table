import DataTable from "../table/DataTable";
import { Field } from "../table/DataTable";
export declare function cmm(a?: string): string;
export declare function st(f: (a?: any) => string): string;
export declare function foreach<T>(ls: T[], f: (e: T) => string): string;
export declare type ExportParams = {
    name: string;
    tables: DataTable[];
    fields: Field[];
    datas: any[][];
    objects: any[];
    xxtea: (str: string, key: string, deflate: boolean) => string;
    inject: {
        [key: string]: boolean;
    };
    packagename: string | undefined;
};
export declare function export_stuff(paras: ExportParams): string | null;
