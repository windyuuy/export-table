import { WorkbookManager } from "..";


export type HandleBatchParams = {
	workbookManager: WorkbookManager
	xxtea: (str: string, key: string, deflate: boolean) => string;
	inject: {
		[key: string]: boolean;
	};
	packagename: string | undefined;
	outPath: string
};
