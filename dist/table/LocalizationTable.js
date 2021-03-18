"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
/**
 * 专门处理多语言的数据
 * 第一行表示该数据列的类型 key zh zh-TW en id jp 等等
 * 中间允许空行
 */
class LocalizationTable {
    constructor(
    /**
     * 当前操作的数据页
     */
    sheet) {
        this.sheet = sheet;
    }
    /**
     * 获取所有有效的key
     */
    get keys() {
        let list = this.sheet.getColumValue(0);
        if (!list)
            return [];
        list.splice(0, 1); //去除第一项
        let result = [];
        for (let k of list) {
            if (typeof k == "string") {
                result.push(k);
            }
        }
        return result;
    }
    /**
     * 获取所有语言
     */
    get languages() {
        let list = this.sheet.getRowValue(0);
        if (!list)
            return [];
        list.splice(0, 1); //去除第一项
        let result = [];
        for (let k of list) {
            if (typeof k == "string") {
                result.push(k);
            }
        }
        return result;
    }
    /**
     * 获取指定语言的值
     * @param key key
     * @param lang 语言
     */
    getValue(key, lang) {
        let keys = this.sheet.getColumValue(0);
        let langs = this.sheet.getRowValue(0);
        if (!keys || !langs)
            return null;
        let keyIndex = keys.indexOf(key);
        let langIndex = langs.indexOf(lang);
        if (keyIndex == -1 || langIndex == -1)
            return null;
        let value = this.sheet.getValue(keyIndex, langIndex);
        if (typeof value == "string") {
            return value;
        }
        else if (value == null) {
            return "";
        }
        else {
            return value.toString();
        }
    }
    /**
     * 设置指定语言的值 如果语言不存在则会创建，如果key不存在也会创建
     * @param key key
     * @param lang 语言
     * @param value 值
     */
    setValue(key, lang, value, style) {
        let keys = this.sheet.getColumValue(0);
        let langs = this.sheet.getRowValue(0);
        if (!keys || !langs) {
            this.sheet.setValue(0, 0, "key");
            keys = [];
            langs = [];
        }
        else {
            //取消key值
            keys.splice(0, 1);
            langs.splice(0, 1);
        }
        if (!keys || !langs)
            return null;
        let keyIndex = keys.indexOf(key);
        let langIndex = langs.indexOf(lang);
        if (keyIndex == -1) {
            //创建key
            keyIndex = this.sheet.rowLength;
            this.sheet.setValue(keyIndex, 0, key);
        }
        else {
            keyIndex += 1; //排除第一个字段
        }
        if (langIndex == -1) {
            //创建lang
            langIndex = this.sheet.columnLength;
            this.sheet.setValue(0, langIndex, lang);
        }
        else {
            langIndex += 1; //排除第一个字段
        }
        this.sheet.setValue(keyIndex, langIndex, value);
        if (style) {
            if (style.color) {
                this.sheet.setColor(keyIndex, langIndex, style.color);
            }
            if (style.background) {
                this.sheet.setBackground(keyIndex, langIndex, style.background);
            }
            if (style.describe) {
                this.sheet.setDescribe(keyIndex, langIndex, style.describe);
            }
        }
    }
    setKeyDescribe(key, describe) {
        let keys = this.sheet.getColumValue(0);
        let langs = this.sheet.getRowValue(0);
        if (!keys || !langs) {
            this.sheet.setValue(0, 0, "key");
            keys = [];
            langs = [];
        }
        else {
            //取消key值
            keys.splice(0, 1);
            langs.splice(0, 1);
        }
        if (!keys || !langs)
            return null;
        let keyIndex = keys.indexOf(key);
        this.sheet.setDescribe(keyIndex + 1, 0, describe);
    }
    /**
     * 设置某个key整行的背景颜色
     * @param key key
     * @param color 颜色值
     */
    setRowBackground(key, color) {
        let keys = this.sheet.getColumValue(0);
        if (!keys)
            return;
        let keyIndex = keys.indexOf(key);
        if (keyIndex == -1) {
            return;
        }
        let cells = this.sheet.getRow(keyIndex);
        if (cells)
            for (let c of cells) {
                c.background = color;
            }
    }
    /**
     * 提取某一语言的所有数据 值可能为空
     * @param lang 语言
     */
    extractLangeData(lang) {
        let data = {};
        let keys = this.keys;
        for (let k of keys) {
            data[k] = this.getValue(k, lang);
        }
        return data;
    }
    /**
     * 存入新的表
     * @param localTable
     */
    putNewTable(localTable, defaultLang) {
        let oldKeys = this.keys;
        let newKeys = localTable.keys;
        console.log("old", oldKeys.length, "new", newKeys.length);
        //将新的中不存在的标红
        for (let oldk of oldKeys) {
            if (newKeys.indexOf(oldk) == -1) {
                this.setRowBackground(oldk, "FF0000");
                console.log(chalk_1.default.bgRed("lose key", oldk));
            }
        }
        //将新的key插入旧表
        for (let newk of newKeys) {
            if (oldKeys.indexOf(newk) == -1) {
                this.setValue(newk, defaultLang, localTable.getValue(newk, defaultLang));
                this.setRowBackground(newk, "FFFF00");
                console.log(chalk_1.default.bgYellow("add key", newk));
            }
            else {
                //判断值是否有变化 有变化的文字标蓝色
                let oldValue = this.getValue(newk, defaultLang);
                let newValue = localTable.getValue(newk, defaultLang);
                if (oldValue != newValue) {
                    this.setValue(newk, defaultLang, newValue, { color: "0000FF", describe: oldValue });
                    console.log(chalk_1.default.blue(oldValue, ">", newValue));
                }
            }
        }
    }
}
exports.default = LocalizationTable;
//# sourceMappingURL=LocalizationTable.js.map