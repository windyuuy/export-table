
export type FiledType = "any" | "uid" | "number" | "number[]" | "bool" | "bool[]" | "string" | "object" | "object[]" | "fk" | "string*" | "string[]" | "key" | "fk[]"


export class Field {

	/**
	 * 是否跳过该字段
	 */
	skip: boolean = false;

	name: string;
	describe: string;
	type: FiledType;

	//外键
	fkTableName: string | undefined;
	fkFieldName: string | undefined;

	//翻译
	translate: boolean = false;
	constructor(name: string, describe: string, type: FiledType) {
		this.name = name;
		this.describe = describe;
		this.type = type;
	}
}
