export declare type FiledType = "any" | "uid" | "number" | "number[]" | "bool" | "bool[]" | "string" | "object" | "object[]" | "fk" | "string*" | "string[]" | "key" | "fk[]";
export declare class Field {
    /**
     * 是否跳过该字段
     */
    skip: boolean;
    name: string;
    describe: string;
    type: FiledType;
    fkTableName: string | undefined;
    fkFieldName: string | undefined;
    translate: boolean;
    constructor(name: string, describe: string, type: FiledType);
}
