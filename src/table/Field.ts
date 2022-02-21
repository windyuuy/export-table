import { FieldExtendMode, FieldMeta } from "./meta/FieldMeta";

export type FiledType = "any" | "uid" | "number" | "number[]" | "bool" | "bool[]" | "string" | "object" | "object[]" | "fk" | "string*" | "string[]" | "key" | "fk[]"


export class Field {
	/**
	 * 是否跳过该字段
	 */
	skip: boolean = false;
	skipOrigin: boolean = false;

	name: string;
	nameOrigin: string;
	describe: string;
	type: FiledType;

	index: number = -1

	//外键
	fkTableName: string | undefined;
	fkFieldName: string | undefined;


	//翻译
	translate: boolean = false;
	constructor(name: string, describe: string, type: FiledType) {
		this.nameOrigin = name;
		this.name = name
		this.describe = describe;
		this.type = type;
	}

	get isFKField() {
		return this.fkTableName != null
	}

	applyMeta(fieldMeta: FieldMeta) {
		if (fieldMeta.exportName) {
			this.name = fieldMeta.exportName
		}

		if (fieldMeta.type) {
			this.type = fieldMeta.type
		}

		if (fieldMeta.extendMode == FieldExtendMode.Sub) {
			this.skip = true
		} else {
			this.skip = false
		}
	}

}
