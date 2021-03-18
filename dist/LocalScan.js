"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
class LocalScan {
    /**
     * 获取key value 值
     * @param source 源数据
     * @param index 起点索引
     */
    static getKeyValue(source, index) {
        //查找到第一个(，则表示开始扫描
        //查找到引号则表示开始字符串扫描
        //查找到)表示扫描结束
        let isStart = false;
        let isEnd = false;
        let key = "";
        let value = "";
        let inStr = false; //当前正在匹配字符串
        let strFlag = "null"; //当前字符串用的引号
        let isKey = true; //先查找key
        for (var pos = index; pos < source.length; pos++) {
            let char = source[pos];
            if (isStart == false && char == "(") {
                isStart = true;
            }
            else if (isStart && inStr == false && (char == "\"" || char == "'" || char == "`")) {
                //进入字符串模式
                inStr = true;
                strFlag = char;
            }
            else if (inStr == true && char == strFlag && source[pos - 1] != "\\") {
                //退出字符串模式
                inStr = false;
                if (isKey == true) {
                    key = strFlag + key + strFlag;
                }
                else if (isKey == false) {
                    value = strFlag + value + strFlag;
                    //匹配结束
                    isEnd = true;
                    break;
                }
            }
            else if (inStr == true && isKey) {
                key += char;
            }
            else if (inStr == true && isKey == false) {
                value += char;
            }
            else if (isStart && inStr == false && char == ",") {
                if (isKey == true) {
                    isKey = false; //开始匹配value
                }
                else {
                    isEnd = true; //匹配结束
                    break;
                }
            }
            else if (isStart && inStr == false && char == ")") {
                isEnd = true; //匹配结束
                break;
            }
        }
        try {
            let result = { key: eval(key), value: eval(value), endPos: pos };
            return result;
        }
        catch (e) {
            console.error(chalk_1.default.red("出现异常字符串", key, value));
            console.error(chalk_1.default.red(e));
            return { key: null, value: null, endPos: pos };
        }
    }
    /**
     * 扫描纹理
     * @param source
     */
    static scan(content) {
        //分析脚本
        let result = [];
        let findFlags = ["slib.i18n.locString(", "slib.i18n.format(", "STRINGS("];
        for (let flag of findFlags) {
            let pos = 0;
            let startPos = 0;
            while (pos = content.indexOf(flag, startPos), pos != -1) {
                let value = this.getKeyValue(content, pos);
                if (value.key != null) {
                    result.push(value);
                }
                startPos = value.endPos;
            }
        }
        return result;
    }
}
exports.default = LocalScan;
//# sourceMappingURL=LocalScan.js.map