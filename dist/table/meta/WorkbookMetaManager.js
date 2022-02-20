"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkbookMetaManager = void 0;
class WorkbookMetaManager {
    sceneMetas = [];
    addSceneMeta(sceneMeta) {
        this.sceneMetas.push(sceneMeta);
    }
    getSceneMeta(name) {
        return this.sceneMetas.find(m => m.name == name);
    }
}
exports.WorkbookMetaManager = WorkbookMetaManager;
//# sourceMappingURL=WorkbookMetaManager.js.map