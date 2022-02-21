import { FieldMeta } from "./meta/FieldMeta";
export declare type FiledType = "any" | "uid" | "number" | "number[]" | "bool" | "bool[]" | "string" | "object" | "object[]" | "fk" | "string*" | "string[]" | "key" | "fk[]";
export declare class Field {
    /**
     * 是否跳过该字段
     */
    skip: boolean;
    skipOrigin: boolean;
    name: string;
    nameOrigin: string;
    describe: string;
    type: FiledType;
    index: number;
    fkTableName: string | undefined;
    fkFieldName: string | undefined;
    translate: boolean;
    constructor(name: string, describe: string, type: FiledType);
    get isFKField(): boolean;
    applyMeta(fieldMeta: FieldMeta): void;
}
