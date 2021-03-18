"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.export_cs = exports.st = exports.cmm = void 0;
function cmm(a) { return ""; }
exports.cmm = cmm;
function st(f) {
    return f();
}
exports.st = st;
function export_cs(paras) {
    let { datas, fields, inject, name, objects, packagename, tables, xxtea, } = paras;
    let firstLetterUpper = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    let firstLetterLower = function (str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    };
    let convMemberName = firstLetterUpper;
    let convVarName = firstLetterLower;
    let RowClass = firstLetterUpper(name);
    let initFunc = name + "Init";
    let mapfield = fields.find(a => a.type == "key"); //如果是map，则生成对应的map
    let mapName = name + "Map";
    let getFieldType = function (t) {
        if (t == "object") {
            throw new Error("invalid type <object>");
        }
        else if (t == "object[]") {
            throw new Error("invalid type <object[]>");
        }
        else if (t == "number") {
            return "double";
        }
        else if (t == "number[]") {
            return "double[]";
        }
        else if (t == "uid") {
            return "int";
        }
        else if (t == "bool") {
            return "bool";
        }
        else if (t == "bool[]") {
            return "bool[]";
        }
        else if (t == "string") {
            return "string";
        }
        else if (t == "string[]") {
            return "string[]";
        }
        else if (t == "fk") {
            return "int";
        }
        else if (t == "fk[]") {
            return "int[]";
        }
        else if (t == "any") {
            throw new Error("invalid type <any>");
        }
        else if (t == "key") {
            return "string";
        }
        else {
            throw new Error("invalid type <unkown>");
        }
        return t;
    };
    const genValue = (value, t) => {
        if (t == "object") {
            throw new Error("invalid type <object>");
        }
        else if (t == "object[]") {
            throw new Error("invalid type <object[]>");
        }
        else if (t == "number") {
            return `${value}`;
        }
        else if (t == "number[]") {
            let values = value;
            return `new double[]{${values.join(", ")}}`;
        }
        else if (t == "uid") {
            return `${value}`;
        }
        else if (t == "bool") {
            return `${value}`;
        }
        else if (t == "bool[]") {
            let values = value;
            return `new bool[]{${values.join(", ")}}`;
        }
        else if (t == "string") {
            return `"${value}"`;
        }
        else if (t == "string[]") {
            let values = value;
            return `new string[]{${values.map(v => `"${v}"`).join(", ")}}`;
        }
        else if (t == "fk") {
            return `${value}`;
        }
        else if (t == "fk[]") {
            let values = value;
            return `new int[]{${values.join(", ")}}`;
        }
        else if (t == "any") {
            throw new Error("invalid type <any>");
        }
        else if (t == "key") {
            return `${value}`;
        }
        throw new Error("invalid type <unkown>");
    };
    let temp = `
using System.Collections.Generic;

public class ${RowClass} {

	public static List<${RowClass}> Configs = new List<${RowClass}>()
	{
${st(() => datas.map(data => `		new ${RowClass}(${st(() => fields.map((f, index) => genValue(data[index], f.type)).join(", "))}),`).join("\n"))}
	};

	public ${RowClass}() { }
	public ${RowClass}(${st(() => fields.map(f => `${getFieldType(f.type)} ${convVarName(f.name)}`).join(", "))})
	{
${st(() => fields.map(f => `		this.${convMemberName(f.name)} = ${convVarName(f.name)};`).join("\n"))}
	}


	public ${RowClass} MergeFrom(${RowClass} source)
	{
${st(() => fields.map(f => `		this.${convMemberName(f.name)} = source.${convMemberName(f.name)};`).join("\n"))}
		return this;
	}

	public ${RowClass} Clone()
	{
		var config = new ${RowClass}();
		config.MergeFrom(this);
		return config;
	}

	${cmm( /**生成字段 */)}
	${(() => fields.map(f => `
	/// <summary>
	/// ${f.describe}
	/// </summary>
	public ${getFieldType(f.type)} ${convMemberName(f.name)};
	`).join(""))()}
}
`;
    return temp;
}
exports.export_cs = export_cs;
//# sourceMappingURL=export_cs.js.map