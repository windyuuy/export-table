/// <reference types="yargs" />
export declare var command: string;
export declare var describe: string;
export declare function builder(yargs: typeof import("yargs")): import("yargs").Argv<import("yargs").Defined<{
    from: string | undefined;
} & {
    to: string | undefined;
} & {
    one: string | undefined;
} & {
    onename: string | undefined;
} & {
    alls: (string | number)[] | undefined;
} & {
    allnames: (string | number)[] | undefined;
} & {
    inject: (string | number)[] | undefined;
} & {
    packagename: string | undefined;
} & {
    tableNameFirstLetterUpper: boolean | undefined;
}, "from" | "to">>;
export declare function handler(argv: any): Promise<void>;
