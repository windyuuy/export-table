import { WorkbookMeta } from "./WorkbookMeta";
export declare class WorkbookMetaManager {
    sceneMetas: WorkbookMeta[];
    addSceneMeta(sceneMeta: WorkbookMeta): void;
    getSceneMeta(name: string): WorkbookMeta | undefined;
}
