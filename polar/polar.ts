import { PolarOptions } from "./types";

const defaultOptions: Partial<PolarOptions> = {
    delay: 2000,
    onPoll: (response, stop) => {},
    continueOnError: false
};

class Polar {

    options: PolarOptions;
    stopPoll = false;
    count = 0;
    error = null;

    public constructor(options: PolarOptions) {
        this.options = {...defaultOptions, ...options};
        this.stop = this.stop.bind(this);
    }


    public async start(): Promise<any> {
        this.count++;
        this.stopPoll = false;
        this.error = null;
        const r = await this.options.request();
        this.onPoll(r);
        if (this.stopPoll || this.limitReached()) {
            return r;
        } else {
            return await this.pollWithDelay();
        }
    }

    public stop() {
        this.stopPoll = true;
    }

    private limitReached(): boolean {
        return this.options.limit && (this.count === this.options.limit);
    }

    private onPoll(request: any) {
        this.options.onPoll(request, this.stop, this.error);
    }

    private pollWithDelay(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const poll = await this.start();
                    return resolve(poll);
                } catch (e) {
                    this.error = e;
                    if (this.options.continueOnError) {
                        return await this.start();
                    } else {
                        reject(e);
                    }
                }
            }, this.options.delay);
        });
    }
}

module.exports = Polar;
