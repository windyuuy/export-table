import Sheet from "./Sheet";
/**
 * 专门处理多语言的数据
 * 第一行表示该数据列的类型 key zh zh-TW en id jp 等等
 * 中间允许空行
 */
export default class LocalizationTable {
    /**
     * 当前操作的数据页
     */
    sheet: Sheet;
    constructor(
    /**
     * 当前操作的数据页
     */
    sheet: Sheet);
    /**
     * 获取所有有效的key
     */
    get keys(): string[];
    /**
     * 获取所有语言
     */
    get languages(): string[];
    /**
     * 获取指定语言的值
     * @param key key
     * @param lang 语言
     */
    getValue(key: string, lang: string): string | null;
    /**
     * 设置指定语言的值 如果语言不存在则会创建，如果key不存在也会创建
     * @param key key
     * @param lang 语言
     * @param value 值
     */
    setValue(key: string, lang: string, value: string, style?: {
        color?: string;
        background?: string;
        describe?: string;
    }): null | undefined;
    setKeyDescribe(key: string, describe: string): null | undefined;
    /**
     * 设置某个key整行的背景颜色
     * @param key key
     * @param color 颜色值
     */
    setRowBackground(key: string, color: string): void;
    /**
     * 提取某一语言的所有数据 值可能为空
     * @param lang 语言
     */
    extractLangeData(lang: string): {
        [key: string]: string | null;
    };
    /**
     * 存入新的表
     * @param localTable
     */
    putNewTable(localTable: LocalizationTable, defaultLang: string): void;
}
