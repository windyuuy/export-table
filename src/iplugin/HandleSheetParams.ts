import { DataTable, WorkbookManager } from "..";
import { Field } from "../table/Field";
import { OutFilePath } from "./OutFilePath";

export type HandleSheetParams = {
	/**
	 * 当前sheet名
	 */
	name: string;
	/**
	 * 当前处理中的所有表
	 */
	tables: DataTable[];
	/**
	 * 工作簿管理器
	 */
	workbookManager: WorkbookManager
	/**
	 * 当前sheet包装类
	 */
	table: DataTable
	/**
	 * 所有字段定义
	 */
	fields: Field[];
	/**
	 * sheet 中所有数据
	 * - any[行索引][行子项索引]
	 * - 不会包含跳过的字段
	 */
	datas: any[][];
	/**
	 * 对象列表
	 * - 一个对象对应一行记录
	 * - 不会包含跳过的字段
	 */
	objects: any[];
	xxtea: (str: string, key: string, deflate: boolean) => string;
	inject: {
		[key: string]: boolean;
	};
	/**
	 * 包名
	 */
	packagename: string | undefined;
	/**
	 * 导出路径
	 */
	outPath: string
	/**
	 * 文件导出路径
	 */
	outFilePath: OutFilePath
};
