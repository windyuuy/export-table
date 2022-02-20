import { DataTable } from "../DataTable"
import { Workbook } from "../Workbook"
import { SheetMeta } from "./SheetMeta"

/**
 * 继承模式
 */
export enum WorkbookExtendMode {
	Sub = "-",
	Add = "+",
}

export class WorkbookMeta {
	constructor(
		/**
		 * 源名称
		 */
		public name: string,
		public workbook: Workbook,
		public data: string[][],
	) {

	}

	/**
	 * 导出模式
	 */
	extendMode: WorkbookExtendMode = WorkbookExtendMode.Add
	sheetMetas: SheetMeta[] = []

	addSheetMeta(sheetMeta: SheetMeta) {
		this.sheetMetas.push(sheetMeta)
	}

	getMetaSheetNames(): string[] {
		return this.data.map(col => {
			return col.find(cell => {
				return typeof (cell) == "string" && cell.startsWith("#sheet ")
			})!
		})
	}

	applyMeta(dataTables: DataTable[]) {
		for (const sheetMeta of this.sheetMetas) {
			let dataTable = dataTables.find(t => t.sheet == sheetMeta.sheet)!
			dataTable.applyMeta(sheetMeta)
		}
	}
}
