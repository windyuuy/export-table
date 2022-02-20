import { WorkbookMeta } from "./WorkbookMeta"

export class WorkbookMetaManager {
	sceneMetas: WorkbookMeta[] = []

	addSceneMeta(sceneMeta: WorkbookMeta) {
		this.sceneMetas.push(sceneMeta)
	}

	getSceneMeta(name: string) {
		return this.sceneMetas.find(m => m.name == name)
	}
}
