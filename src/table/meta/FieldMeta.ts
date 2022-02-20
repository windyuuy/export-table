import { Field, FiledType } from "../Field"

/**
 * 继承模式
 */
export enum FieldExtendMode {
	Sub = "-",
	Add = "+",
}

export class FieldMeta {
	/**
	 * 导出类型
	 */
	type?: FiledType
	/**
	 * 导出名称
	 */
	exportName?: string
	/**
	 * 继承模式
	 */
	extendMode: FieldExtendMode = FieldExtendMode.Add
	name: string

	constructor(
		/**
		 * 源名称
		 */
		public data: string,
	) {
		let m = data.match(/(?:\:(\-))?(?:([\w]+)(?:\:(\w+))?\=)?(\w+)/)!
		let sign = m[1]
		let exportName = m[2]
		let type = m[3]
		let fieldName = m[4]
		this.name = fieldName
		this.exportName = exportName
		this.type = type as FiledType
		this.extendMode = sign == "-" ? FieldExtendMode.Sub : FieldExtendMode.Add
	}
}
