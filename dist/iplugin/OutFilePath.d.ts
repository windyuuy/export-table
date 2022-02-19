export declare class OutFilePath {
    /**
     * 导出路径
     */
    outPath: string;
    /**
     * 文件名
     */
    baseName: string;
    /**
     * 扩展名
     */
    ext: string;
    constructor(
    /**
     * 导出路径
     */
    outPath: string, 
    /**
     * 文件名
     */
    baseName: string, 
    /**
     * 扩展名
     */
    ext: string);
    get fullPath(): string;
    merge(out: OutFilePath): this;
    clone(): OutFilePath;
}
