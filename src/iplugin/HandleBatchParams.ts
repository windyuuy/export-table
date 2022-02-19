import { DataTable, WorkbookManager } from "..";


export type HandleBatchParams = {
	/**
	 * 工作簿管理器
	 */
	workbookManager: WorkbookManager
	/**
	 * 当前处理中的所有表
	 */
	tables: DataTable[]
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
};
