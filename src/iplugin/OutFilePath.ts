
import * as path from "path"

export class OutFilePath {
	constructor(
		/**
		 * 导出路径
		 */
		public outPath: string,
		/**
		 * 文件名
		 */
		public baseName: string,
		/**
		 * 扩展名
		 */
		public ext: string
	) {
	}

	/**
	 * 完整路径
	 */
	get fullPath() {
		return path.join(this.outPath, this.baseName + this.ext)
	}

	merge(out: OutFilePath) {
		this.outPath = out.outPath
		this.baseName = out.baseName
		this.ext = out.ext
		return this
	}

	clone() {
		return new OutFilePath(this.outPath, this.baseName, this.ext)
	}
}
