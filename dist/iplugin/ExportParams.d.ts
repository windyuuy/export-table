import { DataTable } from "..";
import { Field } from "../table/Field";
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
