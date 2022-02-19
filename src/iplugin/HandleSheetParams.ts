import { DataTable, WorkbookManager } from "..";
import { Field } from "../table/Field";
import { OutFilePath } from "./OutFilePath";

export type HandleSheetParams = {
	name: string;
	tables: DataTable[];
	workbookManager: WorkbookManager
	table: DataTable
	fields: Field[];
	/**
	 * sheet 中所有数据
	 * - any[行索引][行子项索引]
	 */
	datas: any[][];
	/**
	 * 对象列表
	 * - 一个对象对应一行记录
	 */
	objects: any[];
	xxtea: (str: string, key: string, deflate: boolean) => string;
	inject: {
		[key: string]: boolean;
	};
	packagename: string | undefined;
	outPath: string
	outFilePath: OutFilePath
};
