import { ExportParams } from "../template/export_cs";
export interface IPlugin {
    cmds: string[];
    exportStuff(paras: ExportParams): string | null;
}
