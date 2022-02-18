import { HandleSheetParams } from "..";
import { HandleBatchParams } from "./HandleBatchParams";

export interface IPlugin {
	name?: string
	tags: string[]
	handleSheet(paras: HandleSheetParams): void
	handleBatch(paras: HandleBatchParams): void
}
