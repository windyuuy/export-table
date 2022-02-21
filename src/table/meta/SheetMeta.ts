import { Sheet } from "../Sheet"
import { FieldMeta } from "./FieldMeta"

/**
 * 继承模式
 */
export enum SheetExtendMode {
	Sub = "-",
	Add = "+",
}

export class SheetMeta {
	public name: string
	public workbookName!: string
	public sheet!: Sheet

	constructor(
		/**
		 * 源名称
		 */
		public data: string[]
	) {
		let sheetMeta = data.find(d => d.startsWith("#sheet "))!
		let m = sheetMeta.match(/\#sheet (\-)?(?:(\w+):)?(\w+)/)!
		let sign = m[1]
		let exportSheetName = m[2]
		let sheetName = m[3]

		this.name = sheetName
		this.exportSheetName = exportSheetName
		this.extendMode = sign == "-" ? SheetExtendMode.Sub : SheetExtendMode.Add
	}

	exportSheetName?: string
	extendMode: SheetExtendMode = SheetExtendMode.Add
	fieldMetas: FieldMeta[] = []

	addFieldMeta(fieldMeta: FieldMeta) {
		this.fieldMetas.push(fieldMeta)
	}
}
