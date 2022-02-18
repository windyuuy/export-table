import { IPlugin } from "..";
import { HandleBatchParams } from "./HandleBatchParams";
import { HandleSheetParams } from "./HandleSheetParams";

export class PluginBase implements IPlugin {
	name: string = "unkown";
	tags: string[] = [];
	handleSheet(paras: HandleSheetParams): void {
	}
	handleBatch(paras: HandleBatchParams): void {
	}

}
