"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExcelManager_1 = require("./ExcelManager");
const JsonToLua_1 = require("./JsonToLua");
const path = require("path");
const AutoPath_1 = require("./quick_library/AutoPath");
const xxtea_1 = require("./xxtea");
class Field {
    constructor(name, describe, type) {
        this.name = name;
        this.describe = describe;
        this.type = type;
    }
}
class Table {
    /**
     * 表格信息
     * @param excelpath 表格所在路径
     * @param data 表格数据
     */
    constructor(excelpath, data) {
        this._fieldList = [];
        this._data = [];
        this.encrypt_data = "";
        this.encrypt_key = "";
        this._path = excelpath;
        this._name = path.basename(excelpath, path.extname(excelpath));
        let info = AutoPath_1.default.instance.getAutoPathInfoFromFilepath(excelpath);
        if (info) {
            this._autoPathInfo = info.info;
        }
        else {
            this._autoPathInfo = new AutoPath_1.AutoPathInfo(); //默认信息
        }
        if (data.length <= 3) {
            return;
        }
        for (let i = 0; i < data[1].length; i++) {
            //第一行 注释
            //第二行 字段名
            //第三行 字段类型
            let des = String(data[0][i]).trim();
            let name = String(data[1][i]).trim();
            let type = String(data[2][i]).trim();
            let fkTableName;
            let fkFieldName;
            let typeList = ["any", "uid", "number", "number[]", "bool", "bool[]", "string", "object", "object[]"];
            if (typeList.indexOf(type.toLowerCase()) != -1) {
                //常规类型
            }
            else if (type.substr(0, 2).toLowerCase() == "fk") {
                //外键
                let param = type.split(/\s+/);
                if (param.length < 3) {
                    console.error(`表 ${this._name} 外键 ${type} 配置错误`);
                    return;
                }
                fkTableName = param[1];
                fkFieldName = param[2];
                type = "fk";
            }
            else {
                //不支持的类型
                type = "any";
            }
            let field = new Field(name, des, type);
            field.fkTableName = fkTableName;
            field.fkFieldName = fkFieldName;
            this._fieldList.push(field);
        }
        //对每一行数据进行计算
        for (let i = 3; i < data.length; i++) {
            let line = [];
            let lineData = data[i];
            for (let l = 0; l < lineData.length; l++) {
                let data = lineData[l];
                let field = this._fieldList[l];
                if (field)
                    line.push(this.getNewData(field, data, i + 1));
            }
            this._data.push(line);
        }
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
                console.error(`表${this._name} 行${lineNumber} 字段${field.name} uid类型值填写错误 ${data}`);
            }
            return newValue;
        }
        else if (field.type == "number") {
            if (data == undefined || data == "")
                data = 0;
            let newValue = parseFloat(data);
            if (isNaN(newValue)) {
                newValue = 0;
                console.error(`表${this._name} 行${lineNumber} 字段${field.name} number类型值填写错误 ${data}`);
            }
            return newValue;
        }
        else if (field.type == "number[]") {
            if (data == undefined || data == "" || data == "[]")
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
                        console.error(`表${this._name} 行${lineNumber} 字段${field.name} number[]类型值填写错误 ${data}`);
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
            if (data == undefined || data == "")
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
            return String(data);
        }
        else if (field.type == "object") {
            try {
                let json = eval("(function(){return " + String(data) + "})()");
                return json;
            }
            catch (e) {
                console.error(`表${this._name} 行${lineNumber} 字段${field.name} object类型值填写错误 ${data}`);
                return {};
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
                console.error(`表${this._name} 行${lineNumber} 字段${field.name} object[]类型值填写错误 ${data}`);
                return [];
            }
        }
        else if (field.type == "fk") {
            if (isNaN(parseInt(data))) {
                console.error(`表${this._name} 行${lineNumber} 字段${field.name} fk类型值填写错误 ${data}`);
            }
            return data;
        }
    }
    get fileName() {
        return this._name;
    }
    /**
     * 检查表格格式是否错误
    */
    checkError() {
        //检查 uid 和 fk
        for (let i = 0; i < this._fieldList.length; i++) {
            let field = this._fieldList[i];
            if (field.type == "uid") {
                //唯一ID 检查
                let map = [];
                for (let j = 0; j < this._data.length; j++) {
                    let line = this._data[j];
                    let v = line[i]; //找到相应的值
                    if (map[v] == true) {
                        console.error(`表${this._name} 行${j + 4} 字段${field.name} 出现重复值 ${v}`);
                    }
                    map[v] = true;
                }
            }
            else if (field.type == "fk") {
                //外键检查
                let fkTable = ExcelManager_1.default.instance.getTableByName(field.fkTableName, this._autoPathInfo);
                if (fkTable == null) {
                    console.error(`${this._autoPathInfo.key} 表${this._name} 字段${field.name} 无法找到外键表 ${field.fkTableName}`);
                    continue;
                }
                let list = fkTable.getFieldValueList(field.fkFieldName);
                for (let j = 0; j < this._data.length; j++) {
                    let line = this._data[j];
                    let v = line[i]; //找到相应的值
                    if (list.indexOf(v) == -1) {
                        console.error(`表${this._name} 行${j + 4} 字段${field.name} 无法找到外键值 ${v}`);
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
        for (let i = 0; i < this._fieldList.length; i++) {
            if (this._fieldList[i].name == fieldName) {
                for (let j = 0; j < this._data.length; j++) {
                    let line = this._data[j];
                    result.push(line[i]);
                }
                break;
            }
        }
        return result;
    }
    getJsonData() {
        let result = "[\n";
        for (let i = 0; i < this._data.length; i++) {
            let line = this._data[i];
            let value = JSON.stringify(line);
            if (i != 0)
                result += ",";
            result += value + "\n";
        }
        result += "]";
        return result;
    }
    /**
     * 导出JS代码
     * @param temp 模板
     */
    exportJS(temp) {
        let data = this.getJsonData();
        temp = temp.replace("{{DATA}}", data);
        //生成NOTE定义信息
        let note = "";
        for (let i = 0; i < this._fieldList.length; i++) {
            let field = this._fieldList[i];
            let line = `${field.name} ${field.type} ${field.describe} \r`;
            note += line;
        }
        temp = temp.replace("{{NOTE}}", note);
        //生成 Filed 变量
        let filed = "[";
        for (let i = 0; i < this._fieldList.length; i++) {
            let field = this._fieldList[i];
            let line = `"${field.name}",`;
            filed += line;
        }
        filed += "]";
        temp = temp.replace("{{FILED}}", filed);
        return temp;
    }
    /**
     * 导出TS代码
     * @param temp 模板
     */
    exportTS(temp) {
        let data = this.getJsonData();
        const lettersr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
            // +'_~!@#$%^&*()+`-={}:"|[];<>?,./'
            + '_#%^&@*=+-';
        const letterst = lettersr.split('');
        // letterst=letterst.concat([
        // '\\\\',
        // '\\n','\\r','\\t',
        // ])
        let pswlen = Math.random() * 128 + 64;
        let pswt = [];
        for (let i = 0; i < pswlen; i++) {
            const c = letterst[Math.floor(Math.random() * letterst.length)];
            pswt.push(c);
        }
        let psw = pswt.join('').replace("'", "\\'").replace('"', '\\"');
        let className = `${this.fileName}Row`;
        let encryptKey = psw;
        let dataTable = eval(data);
        let encryptDataRecordsString = xxtea_1.XXTEA.encryptToBase64(JSON.stringify(dataTable), "fmrarm" + encryptKey);
        let note = "";
        temp = temp.replace("{{NOTE}}", note);
        temp = temp.replace(/{{CLASSNAME}}/g, className);
        temp = temp.replace(/{{FILENAME}}/g, this.fileName);
        temp = temp.replace(/{{ENCRYPT_KEY}}/g, encryptKey);
        let defaultValueMap = {
            uid: 0,
            string: "''",
            number: 0,
            boolean: false,
            any: '{}',
        };
        // let defaultValueMap=(type)=>{
        //     if(type=='string'){
        //         return ''
        //     }
        // }
        let filed = "[";
        for (let i = 0; i < this._fieldList.length; i++) {
            let field = this._fieldList[i];
            let line = `"${field.name}",`;
            filed += line;
        }
        filed += "]";
        temp = temp.replace("{{FILED}}", filed);
        let objdata = [];
        for (let dl = 0; dl < dataTable.length; dl++) {
            let d = dataTable[dl];
            let obj = {};
            for (let i = 0; i < this._fieldList.length; i++) {
                let field = this._fieldList[i];
                obj[field.name] = d[i];
            }
            objdata.push(obj);
        }
        let objdataStr = JSON.stringify(objdata, null, "\t");
        //生成Type定义信息
        let classproperty = '\n';
        for (let i = 0; i < this._fieldList.length; i++) {
            let field = this._fieldList[i];
            let type = field.type;
            if (type == "object") {
                type = "any";
            }
            let line = `\t${field.name}?:${type} = ${defaultValueMap[type]}\t//${field.describe}\n`;
            classproperty += line;
        }
        console.log(classproperty);
        temp = temp.replace("{{CLASSPROPERTY}}", classproperty);
        //生成Type定义信息
        let safeclassproperty = '\n';
        for (let i = 0; i < this._fieldList.length; i++) {
            let field = this._fieldList[i];
            let type = field.type;
            if (type == "object") {
                type = "any";
            }
            else if (type == "uid") {
                type = "number";
            }
            let line = `\t${field.name}:${type} = ${defaultValueMap[type]}\t//${field.describe}\n`;
            safeclassproperty += line;
        }
        // console.log(safeclassproperty)
        temp = temp.replace("{{SAFECLASSPROPERTY}}", safeclassproperty);
        temp = temp.replace("{{DATA}}", data);
        temp = temp.replace("{{OBJDATA}}", objdataStr);
        temp = temp.replace("{{ENCRYPT_DATA}}", encryptDataRecordsString);
        this.encrypt_key = encryptKey;
        this.encrypt_data = encryptDataRecordsString;
        return temp;
    }
    /**
     * 导出Lua代码
     * @param temp 模板
     */
    exportLua(temp) {
        let data = this.getJsonData();
        let lua = JsonToLua_1.default.to(data);
        temp = temp.replace("{{DATA}}", lua);
        //生成Type定义信息
        let note = "";
        for (let i = 0; i < this._fieldList.length; i++) {
            let field = this._fieldList[i];
            let line = `${field.name} ${field.type} ${field.describe} \r`;
            note += line;
        }
        temp = temp.replace("{{NOTE}}", note);
        //生成 Filed 变量
        let filed = "{";
        for (let i = 0; i < this._fieldList.length; i++) {
            let field = this._fieldList[i];
            let line = `"${field.name}",`;
            filed += line;
        }
        filed += "}";
        temp = temp.replace("{{FILED}}", filed);
        return temp;
    }
    get path() {
        return this._path;
    }
    get autoPathInfo() {
        return this._autoPathInfo;
    }
}
exports.default = Table;
//# sourceMappingURL=Table.js.map