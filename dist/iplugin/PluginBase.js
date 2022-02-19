"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBase = void 0;
/**
 * 插件基类
 */
class PluginBase {
    /**
     * 当前插件的名字
     */
    name = "unkown";
    /**
     * 当前插件的tag
     */
    tags = [];
    /**
     * 处理单张sheet
     * @param paras
     */
    handleSheet(paras) {
    }
    /**
     * 批量处理所有sheet
     * @param paras
     */
    handleBatch(paras) {
    }
}
exports.PluginBase = PluginBase;
//# sourceMappingURL=PluginBase.js.map