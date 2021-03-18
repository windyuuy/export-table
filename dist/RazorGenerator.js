"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const generatorTemplate = `
    function generator($_$){
        var _$_=[];
        {{var}}
        {{code}}
        
        return _$_.join('');
    };
    generator;
`;
class RazorGenerator {
    constructor() {
    }
    /**
     * 将模板转换成js代码
     * ### 模板规则
     * * 使用@符号来引用变量，执行语句
     * ```razor
     * @if(userinfo!=null){
     * 欢迎 @userinfo.name 到场
     * }else{
     * 请登录
     *  @{
     *      var xxx=1
     *  }
     * }
     * @{
     *  var b=xxx||2
     * }
     * @for(let a=0;a<1;a++){
     *  索引：@a
     * }
     * ```
     * @param template
     */
    converToCode(template) {
        //将模板转换成代码
        //遍历文本，进行语法块分析
        let putResult = "";
        let put = ""; //存放常规文本内容
        let blockList = []; //处理嵌套的逻辑组
        let commitPut = () => {
            if (put != "") {
                putResult += `\n_$_.push(\`${put}\`);`;
            }
            put = "";
        };
        for (let i = 0; i < template.length; i++) {
            let char = template[i];
            if (char == "@") {
                let left = template.substr(i, 10);
                if (left.startsWith("@if(")) {
                    //开始if语句块
                    commitPut();
                    let end = this.mathBracket(template, i + 3);
                    end = template.indexOf("{", end); //匹配到大括号
                    putResult += template.substring(i + 1, end + 1); //提交代码
                    blockList.push("if");
                    i = end;
                }
                else if (left.startsWith("@for(")) {
                    //开始for语句块
                    commitPut();
                    let end = this.mathBracket(template, i + 3);
                    end = template.indexOf("{", end); //匹配到大括号
                    putResult += template.substring(i + 1, end + 1); //提交代码
                    blockList.push("for");
                    i = end;
                }
                else if (left.startsWith("@while(")) {
                    //开始while语句
                    commitPut();
                    let end = this.mathBracket(template, i + 3);
                    end = template.indexOf("{", end); //匹配到大括号
                    putResult += template.substring(i + 1, end + 1); //提交代码
                    blockList.push("while");
                    i = end;
                }
                else if (left.startsWith("@switch(")) {
                    //开始switch语句
                    commitPut();
                    let end = this.mathBracket(template, i + 3);
                    end = template.indexOf("{", end); //匹配到大括号
                    end = this.mathBigBracket(template, end); //匹配最后的大括号
                    putResult += template.substring(i + 1, end + 1); //提交代码
                    i = end;
                    //switch不会内嵌文本。因此不需要额外处理
                }
                else if (left.startsWith("@{")) {
                    commitPut();
                    let end = this.mathBigBracket(template, i + 1); //匹配最后的大括号
                    putResult += template.substring(i + 1, end + 1); //提交代码
                    i = end;
                }
                else if (left.startsWith("@@")) {
                    //累加字符串
                    put += "@";
                    i++;
                }
                else {
                    //访问变量
                    commitPut();
                    let end = this.mathVar(template, i + 1);
                    let v = template.substring(i + 1, end + 1);
                    putResult += `\n_$_.push(${v});`;
                    i = end;
                }
            }
            else if (char == "{") {
                //单纯的左括号，也要统计
                put += char;
                blockList.push("str");
            }
            else if (char == "}") {
                if (blockList.length > 0) {
                    if (blockList[blockList.length - 1] == "if") {
                        let left = template.substr(i, 10);
                        if (left.startsWith("}else{")) {
                            commitPut();
                            putResult += "}else{";
                            i = i + 5; //继续累加后面的文字
                        }
                        else if (left.startsWith("}else if(")) {
                            commitPut();
                            let end = this.mathBracket(template, i + 8);
                            putResult += template.substring(i, end + 1);
                            i = end;
                        }
                        else {
                            //结束if
                            commitPut();
                            putResult += "}";
                            blockList.pop();
                        }
                    }
                    else if (blockList[blockList.length - 1] == "str") {
                        //单纯文本
                        put += char;
                        blockList.pop();
                    }
                    else {
                        //直接跳出
                        commitPut();
                        putResult += "}";
                        blockList.pop();
                    }
                }
                else {
                    //当做文字累加
                    put += char;
                }
            }
            else {
                put += char;
            }
        }
        commitPut();
        return generatorTemplate.replace("{{code}}", putResult);
    }
    /**
     * 将转换后的模板处理成函数
     * @param funcStr 转换后的文本
     */
    runTemp(funcStr, data) {
        try {
            let varstr = "";
            for (let key in data) {
                varstr += `\nvar ${key}=$_$.${key}`;
            }
            let func = eval(funcStr.replace("{{var}}", varstr));
            return func(data);
        }
        catch (e) {
            console.error(chalk_1.default.red(e.message, e.stack));
            console.log(chalk_1.default.blue(funcStr));
            return null;
        }
    }
    /**
     * 匹配整个小括号区域
     * > 如果文本中有包含大括号，则必须是成对出现的，否则可能被if for 等语句当成结束符匹配掉
     * ```razor
     * @if(a){//(为被匹配的起点
     *    var a=0;
     *    var b=1;
     *    if(a>b){
     *
     *    }
     * }
     * ```
     */
    mathBracket(str, start) {
        //循环，忽略引号内的括号，找到结束的括号点
        let count = 0; //当前匹配到(的数量
        let inQuotationMark = false; //当前是否在引号内
        let quotationMark = null; //当前所在的引号符号
        for (let i = start; i < str.length; i++) {
            let char = str[i];
            if (inQuotationMark) {
                if (char == "\\") {
                    //遇到转义符 跳过下一个字符
                    i++;
                }
                else if (char == quotationMark) {
                    //遇到引号结束符
                    inQuotationMark = false;
                    quotationMark = null;
                }
            }
            else if (char == "(") {
                count++;
            }
            else if (char == ")") {
                count--;
                if (count == 0) {
                    return i;
                }
            }
            else if (char == '"' || char == "'" || char == "`") {
                inQuotationMark = true;
                quotationMark = char;
            }
        }
        return -1;
    }
    /**
     * 匹配整个大括号区域
     * {为被匹配的起点
     */
    mathBigBracket(str, start) {
        //循环，忽略引号内的括号，找到结束的括号点
        let count = 0; //当前匹配到{的数量
        let inQuotationMark = false; //当前是否在引号内
        let quotationMark = null; //当前所在的引号符号
        for (let i = start; i < str.length; i++) {
            let char = str[i];
            if (inQuotationMark) {
                if (char == "\\") {
                    //遇到转义符 跳过下一个字符
                    i++;
                }
                else if (char == quotationMark) {
                    //遇到引号结束符
                    inQuotationMark = false;
                    quotationMark = null;
                }
            }
            else if (char == "{") {
                count++;
            }
            else if (char == "}") {
                count--;
                if (count == 0) {
                    return i;
                }
            }
            else if (char == '"' || char == "'" || char == "`") {
                inQuotationMark = true;
                quotationMark = char;
            }
        }
        return -1;
    }
    /**
     * 查找变量结构 可以有函数调用
     */
    mathVar(str, start) {
        for (let i = start; i < str.length; i++) {
            let char = str[i];
            if (/[a-zA-Z0-9_\.\[\]]/.exec(char) == null) {
                if (char == "(") {
                    let end = this.mathBracket(str, i);
                    return end;
                }
                else {
                    return i - 1;
                }
            }
        }
        return -1;
    }
}
exports.default = RazorGenerator;
RazorGenerator.instance = new RazorGenerator();
//# sourceMappingURL=RazorGenerator.js.map