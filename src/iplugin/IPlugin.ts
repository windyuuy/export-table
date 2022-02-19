import { HandleSheetParams } from "..";
import { HandleBatchParams } from "./HandleBatchParams";

/**
 * 插件接口
 */
export interface IPlugin {
	/**
	 * 当前插件的名字
	 */
	name?: string
	/**
	 * 当前插件的tag
	 */
	tags: string[]
	/**
	 * 处理单张sheet
	 * @param paras 
	 */
	handleSheet(paras: HandleSheetParams): void
	/**
	 * 批量处理所有sheet
	 * @param paras 
	 */
	handleBatch(paras: HandleBatchParams): void
}
