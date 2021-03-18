
import DataTable from "../table/DataTable";
import { Field } from "../table/DataTable";

export function cmm(a?:string){return ""}
export function st(f:(a?:any)=>string){
	return f()
}

export type ExportParams = {
	name: string
	tables: DataTable[]
	fields: Field[]
	datas: any[][]
	objects: any[]
	xxtea: (str: string, key: string, deflate: boolean) => string
	inject: {
		[key: string]: boolean;
	}
	packagename: string | undefined
}

export function export_cs(paras: ExportParams): string | null {
	let {
		datas,
		fields,
		inject,
		name,
		objects,
		packagename,
		tables,
		xxtea,
	}=paras;
	
	let firstLetterUpper = function (str:string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	let firstLetterLower = function (str: string) {
		return str.charAt(0).toLowerCase() + str.slice(1);
	};
	let RowClass = firstLetterUpper(name)
	let initFunc = name + "Init"
	let mapfield = fields.find(a => a.type == "key")//如果是map，则生成对应的map
	let mapName = name + "Map"

	let getFieldType = function (t: string) {
		if (t == "object") {
			throw new Error("invalid type <object>")
		} else if (t == "object[]") {
			throw new Error("invalid type <object[]>")
		} else if (t == "number") {
			return "double";
		} else if (t == "number[]") {
			return "double[]";
		} else if (t == "uid") {
			return "int";
		} else if (t == "bool") {
			return "bool";
		} else if (t == "bool[]") {
			return "bool[]";
		} else if (t == "string") {
			return "string";
		} else if (t == "string[]") {
			return "string[]";
		} else if (t == "fk") {
			return "int";
		} else if (t == "fk[]") {
			return "int[]";
		} else if (t == "any") {
			throw new Error("invalid type <any>")
		} else if (t == "key") {
			return "string";
		}else{
			throw new Error("invalid type <unkown>")
		}
		return t;
	}

	const genValue=(value:any, t:string):string=>{
		if (t == "object") {
			throw new Error("invalid type <object>")
		} else if (t == "object[]") {
			throw new Error("invalid type <object[]>")
		} else if (t == "number") {
			return `${value}`
		} else if (t == "number[]") {
			let values=value as number[]
			console.log("vlkwjef",values)
			return `new double[]{${values.join(", ")}}`
		} else if (t == "uid") {
			return `${value}`
		} else if (t == "bool") {
			return `${value}`
		} else if (t == "bool[]") {
			let values = value as boolean[]
			return `new bool[]{${values.join(", ")}}`
		} else if (t == "string") {
			return `"${value}"`
		} else if (t == "string[]") {
			let values = value as string[]
			return `new string[]{${values.map(v=>`"${v}"`).join(", ")}}`
		} else if (t == "fk") {
			return `${value}`
		} else if (t == "fk[]") {
			let values = value as number[]
			return `new int[]{${values.join(", ")}}`
		} else if (t == "any") {
			throw new Error("invalid type <any>")
		} else if (t == "key") {
			return `${value}`
		}

		throw new Error("invalid type <unkown>")
	}

	let temp = `
using System.Collections.Generic;

public class ${RowClass} {

	public static List<${RowClass}> Configs = new List<${RowClass}>()
	{
${st(() => 
			datas.map(data => 
`		new ${RowClass}(${st(() => fields.map((f, index) => genValue(data[index],f.type)).join(", "))}),`
			).join("\n")
		)}
	};

	public ${RowClass}() { }
	public ${RowClass}(${st(() => fields.map(f => `${getFieldType(f.type)} ${f.name}`).join(", "))})
	{
${st(() =>
			fields.map(f =>
`		this.${f.name} = ${f.name};`
			).join("\n")
		)}
	}

	${cmm(/**生成字段 */)}
	${(() => fields.map(f=>`
	/// <summary>
	/// ${f.describe}
	/// </summary>
	public ${getFieldType(f.type)} ${firstLetterLower(f.name)};
	`
	).join("")
	)()}
}
`

	return temp

}
