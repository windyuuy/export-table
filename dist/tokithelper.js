"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokitHelper = exports.TokitHelper = void 0;
class TokitHelper {
    launchData;
    launchOptions;
    constructor() {
        this.launchData = process.env['LAUNCH_OPTIOINS'];
        this.launchOptions = this.getLaunchOptioins(this.launchData);
    }
    convToYargs(launchOptions) {
        const values = {};
        const argumentList = launchOptions.execParams.args.argumentList;
        const params = launchOptions.execParams.params.args;
        for (let i in argumentList) {
            if (!params[i]) {
                continue;
            }
            const p = argumentList[i];
            values[p.key] = params[i].value;
        }
        return values;
    }
    getLaunchOptioins(data) {
        if (!data) {
            return undefined;
        }
        return JSON.parse(Buffer.from(data, 'base64').toString());
    }
    get projectDir() {
        return this.launchOptions.session.project;
    }
}
exports.TokitHelper = TokitHelper;
exports.tokitHelper = new TokitHelper();
//# sourceMappingURL=tokithelper.js.map