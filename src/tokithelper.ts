
export class TokitHelper {

	launchData?: string
	launchOptions?: any

	constructor() {
		this.launchData = process.env['LAUNCH_OPTIOINS']
		this.launchOptions = this.getLaunchOptioins(this.launchData)
	}

	convToYargs(launchOptions: any) {
		const values: any = {}
		const argumentList = launchOptions.execParams.args.argumentList
		const params = launchOptions.execParams.params.args
		for (let i in argumentList) {
			if (!params[i]) {
				continue
			}
			const p = argumentList[i]
			values[p.key] = params[i].value
		}
		return values
	}

	getLaunchOptioins(data?: string) {
		if (!data) {
			return undefined
		}
		return JSON.parse(Buffer.from(data, 'base64').toString())
	}

	get projectDir() {
		return this.launchOptions.session.project
	}

}

export const tokitHelper = new TokitHelper()
