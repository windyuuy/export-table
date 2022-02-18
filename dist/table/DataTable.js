"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = void 0;
const chalk_1 = require("chalk");
const Field_1 = require("./Field");
/**
 * 专门处理普通数据表,可设定字段类型，添加移除对象等功能
 */
class DataTable {
    sheet;
    name;
    manager = null;
    constructor(
    /**
     * 当前操作的数据页
     */
    sheet, 
    /**
     * 表名
     */
    name) {
        this.sheet = sheet;
        this.name = name;
    }
    isNullCell(cell) {
        if (cell == null || cell.value == null || String(cell.value).trim() == "") {
            return true;
        }
        return false;
    }
    /**
     * 获取当前表中的字段列表
     */
    get fields() {
        let fieldList = [];
        for (let i = 0; i < this.sheet.data[1].length; i++) {
            //第一行 注释
            //第二行 字段名
            //第三行 字段类型
            if (this.isNullCell(this.sheet.data[0][i]) &&
                this.isNullCell(this.sheet.data[1][i]) &&
                this.isNullCell(this.sheet.data[2][i])) {
                break; //结束
            }
            let des = String(this.sheet.data[0][i].value || "").trim();
            let name = String(this.sheet.data[1][i].value || "").trim();
            let type = String(this.sheet.data[2][i].value || "").trim();
            let fkTableName;
            let fkFieldName;
            let translate = false;
            if (type === "") {
                let skip = new Field_1.Field(name || des, des || name, "any");
                skip.skip = true;
                fieldList.push(skip);
                continue;
            }
            let typeList = ["any", "uid", "number", "number[]", "bool", "bool[]", "string", "string[]", "object", "object[]", "key"];
            if (typeList.indexOf(type.toLowerCase()) != -1) {
                //常规类型
            }
            else if (type.substr(0, 4).toLocaleLowerCase() == "fk[]") { //外键数组
                //外键数组
                let param = type.split(/\s+/);
                if (param.length < 3) {
                    console.error(chalk_1.default.red(`表外键 ${type} 配置错误`));
                    return null;
                }
                fkTableName = param[1];
                fkFieldName = param[2];
                type = "fk[]";
            }
            else if (type.substr(0, 2).toLowerCase() == "fk") {
                //外键
                let param = type.split(/\s+/);
                if (param.length < 3) {
                    console.error(chalk_1.default.red(`表外键 ${type} 配置错误`));
                    return null;
                }
                fkTableName = param[1];
                fkFieldName = param[2];
                type = "fk";
            }
            else if (type == "string*") {
                type = "string";
                translate = true;
            }
            else {
                //不支持的类型
                type = "any";
            }
            let field = new Field_1.Field(name, des, type.toLocaleLowerCase());
            field.fkTableName = fkTableName;
            field.fkFieldName = fkFieldName;
            field.translate = translate;
            if (this.sheet.data[0][i].describe) {
                field.describe += "\n" + this.sheet.data[0][i].describe; //添加备注
            }
            fieldList.push(field);
        }
        return fieldList;
    }
    getNewData(field, data, lineNumber) {
        if (field.type == "any") {
            //any不做任何处理
            return data;
        }
        else if (field.type == "uid") {
            let newValue = parseInt(data);
            if (isNaN(newValue)) {
                newValue = 0;
                console.error(chalk_1.default.red(`表${this.name} 行${lineNumber} 字段${field.name} uid类型值填写错误 ${data}`));
            }
            return newValue;
        }
        else if (field.type == "number") {
            if (data == undefined || data === "")
                data = 0;
            let newValue = parseFloat(data);
            if (isNaN(newValue)) {
                newValue = 0;
                console.error(chalk_1.default.red(`表${this.name} 行${lineNumber} 字段${field.name} number类型值填写错误 ${data}`));
            }
            return newValue;
        }
        else if (field.type == "number[]") {
            if (data == undefined || data === "" || data == "[]")
                data = null;
            if (typeof data == "number") {
                return [data];
            }
            else if (typeof data == "string") {
                data = data.replace(/\[|\]/g, "");
                let list = data.split(/,|;/);
                let result = [];
                for (let i = 0; i < list.length; i++) {
                    let v = parseFloat(list[i]);
                    if (isNaN(v)) {
                        v = 0;
                        console.error(chalk_1.default.red(`表${this.name} 行${lineNumber} 字段${field.name} number[]类型值填写错误 ${data}`));
                    }
                    result.push(v);
                }
                return result;
            }
            else {
                return [];
            }
        }
        else if (field.type == "bool") {
            if (data == undefined || data === "")
                data = false;
            if (typeof data == "boolean") {
                return data;
            }
            else if (String(data).toLowerCase() == "false" || String(data) == "0") {
                return false;
            }
            else if (String(data).toLowerCase() == "true" || String(data) == "1") {
                return true;
            }
            else {
                return Boolean(data);
            }
        }
        else if (field.type == "bool[]") {
            if (data == undefined || data == "" || data == "[]")
                data = null;
            if (typeof data == "boolean") {
                return [data];
            }
            else if (typeof data == "string") {
                data = data.replace(/\[|\]/g, "");
                let list = data.split(/,|;/);
                let result = [];
                for (let i = 0; i < list.length; i++) {
                    let v = list[i];
                    if (v.toLowerCase() == "false" || v == "0") {
                        result.push(false);
                    }
                    else if (v.toLowerCase() == "true" || v == "1") {
                        result.push(true);
                    }
                    else {
                        result.push(Boolean(data));
                    }
                }
                return result;
            }
            else {
                return [];
            }
        }
        else if (field.type == "string") {
            if (data == null) {
                return "";
            }
            return String(data);
        }
        else if (field.type == "string[]") {
            if (data == null) {
                data = "";
            }
            if (data == undefined || data == "" || data == "[]")
                data = null;
            if (typeof data == "string") {
                //使用,,分割字符串
                return data.split(/,,|;;/g);
            }
            else if (typeof data == "number") {
                return [data.toString()];
            }
            else if (data == null) {
                return [];
            }
            else {
                console.error(chalk_1.default.red(`表${this.name} 行${lineNumber} 字段${field.name} string[]类型值填写错误 ${data}`));
                return [];
            }
        }
        else if (field.type == "string*") {
            if (data == null) {
                return "";
            }
            return String(data);
        }
        else if (field.type == "object") {
            try {
                let json = eval("(function(){return " + String(data) + "})()");
                return json;
            }
            catch (e) {
                console.error(chalk_1.default.red(`表${this.name} 行${lineNumber} 字段${field.name} object类型值填写错误 ${data}`));
                return String(data);
            }
        }
        else if (field.type == "object[]") {
            try {
                let json = eval("(function(){return " + String(data) + "})()");
                if (json == null) {
                    return [];
                }
                if (json instanceof Array == false) {
                    return [json];
                }
                return json;
            }
            catch (e) {
                console.error(chalk_1.default.red(`表${this.name} 行${lineNumber} 字段${field.name} object[]类型值填写错误 ${data}`));
                return [];
            }
        }
        else if (field.type == "fk") {
            if (data === null || data === undefined || data === "" || data == "undefined") {
                data = -1;
            }
            else if (isNaN(parseInt(data))) {
                console.error(chalk_1.default.red(`表${this.name} 行${lineNumber} 字段${field.name} fk类型值填写错误 ${data}`));
            }
            return data;
        }
        else if (field.type == "key") {
            if (data == null) {
                return "";
            }
            return String(data);
        }
        else if (field.type == "fk[]") {
            if (data == undefined || data === "" || data == "[]")
                data = null;
            if (typeof data == "number") {
                return [data];
            }
            else if (typeof data == "string") {
                data = data.replace(/\[|\]/g, "");
                let list = data.split(/,|;/);
                let result = [];
                for (let i = 0; i < list.length; i++) {
                    let v = parseFloat(list[i]);
                    if (isNaN(v)) {
                        v = 0;
                        console.error(chalk_1.default.red(`表${this.name} 行${lineNumber} 字段${field.name} number[]类型值填写错误 ${data}`));
                    }
                    result.push(v);
                }
                return result;
            }
            else {
                return [];
            }
        }
    }
    /**
     * 获取所有的数据列表
     */
    getDataList() {
        let fieldList = this.fields;
        if (!fieldList)
            return [];
        let data = [];
        for (let i = 3; i < this.sheet.data.length; i++) {
            let line = [];
            let lineData = this.sheet.data[i];
            if (!lineData || lineData[0].value == null) {
                continue;
            }
            for (let l = 0; l < fieldList.length; l++) {
                let data = lineData[l];
                let field = fieldList[l];
                if (field && field.skip == false)
                    line.push(this.getNewData(field, data && data.value, i + 1));
            }
            data.push(line);
        }
        return data;
    }
    /**
     * 获取经过转换的对象
     */
    getObjectList() {
        let fieldList = this.fields;
        if (!fieldList)
            return [];
        fieldList = fieldList.filter(a => a.skip == false);
        let dataList = this.getDataList();
        let objList = [];
        for (let data of dataList) {
            let obj = {};
            for (let i = 0; i < fieldList.length; i++) {
                let f = fieldList[i];
                obj[f.name] = data[i];
            }
            objList.push(obj);
        }
        return objList;
    }
    /**
     * 检查表格格式是否错误
    */
    checkError() {
        let fieldList = this.fields;
        let data = this.getDataList();
        if (fieldList == null) {
            return;
        }
        fieldList = fieldList.filter(a => a.skip == false);
        //检查 uid 和 fk
        for (let i = 0; i < fieldList.length; i++) {
            let field = fieldList[i];
            if (field.type == "uid") {
                //唯一ID 检查
                let map = [];
                for (let j = 0; j < data.length; j++) {
                    let line = data[j];
                    let v = line[i]; //找到相应的值
                    if (map[v] == true) {
                        console.error(chalk_1.default.red(`表${this.name} 行${j + 4} 字段${field.name} 出现重复值 ${v}`));
                    }
                    map[v] = true;
                }
            }
            else if (field.type == "fk") {
                //外键检查
                let fkTable = this.manager.getTableByName(field.fkTableName);
                if (fkTable == null) {
                    console.error(chalk_1.default.red(`表${this.name} 字段${field.name} 无法找到外键表 ${field.fkTableName}`));
                    continue;
                }
                let list = fkTable.getFieldValueList(field.fkFieldName);
                for (let j = 0; j < data.length; j++) {
                    let line = data[j];
                    let v = line[i]; //找到相应的值
                    if (v && v != -1 && list.indexOf(v) == -1) { //只有明确的值才检查
                        console.error(chalk_1.default.red(`表${this.name} 行${j + 4} 字段${field.name} 无法找到外键值 ${v}`));
                    }
                }
            }
            else if (field.type == "fk[]") {
                //外键数组
                let fkTable = this.manager.getTableByName(field.fkTableName);
                if (fkTable == null) {
                    console.error(chalk_1.default.red(`表${this.name} 字段${field.name} 无法找到外键表 ${field.fkTableName}`));
                    continue;
                }
                let list = fkTable.getFieldValueList(field.fkFieldName);
                for (let j = 0; j < data.length; j++) {
                    let line = data[j];
                    let v = line[i]; //找到相应的值
                    if (v)
                        for (let i = 0; i < v.length; i++) {
                            if (list.indexOf(v[i]) == -1) {
                                console.error(chalk_1.default.red(`表${this.name} 行${j + 4} 字段${field.name} 无法找到外键值 ${v[i]}`));
                            }
                        }
                }
            }
        }
    }
    /**
     * 获取指定字段的值列表
     * @param fieldName 字段名称
     */
    getFieldValueList(fieldName) {
        let result = [];
        let data = this.getDataList();
        let fieldList = this.fields.filter(a => a.skip == false);
        for (let i = 0; i < fieldList.length; i++) {
            if (fieldList[i].name == fieldName) {
                for (let j = 0; j < data.length; j++) {
                    let line = data[j];
                    result.push(line[i]);
                }
                break;
            }
        }
        return result;
    }
}
exports.DataTable = DataTable;
//# sourceMappingURL=DataTable.js.map