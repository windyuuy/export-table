import { IPlugin } from "..";
import { HandleBatchParams } from "./HandleBatchParams";
import { HandleSheetParams } from "./HandleSheetParams";

/**
 * 插件基类
 */
export class PluginBase implements IPlugin {
	/**
	 * 当前插件的名字
	 */
	name: string = "unkown";
	/**
	 * 当前插件的tag
	 */
	tags: string[] = [];
	/**
	 * 处理单张sheet
	 * @param paras 
	 */
	handleSheet(paras: HandleSheetParams): void {
	}
	/**
	 * 批量处理所有sheet
	 * @param paras 
	 */
	handleBatch(paras: HandleBatchParams): void {
	}

}
