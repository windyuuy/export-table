import { IPlugin } from "..";
import { HandleBatchParams } from "./HandleBatchParams";
import { HandleSheetParams } from "./HandleSheetParams";
export declare class PluginBase implements IPlugin {
    name: string;
    tags: string[];
    handleSheet(paras: HandleSheetParams): void;
    handleBatch(paras: HandleBatchParams): void;
}
