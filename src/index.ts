import { PolarActions, PolarOptions, PolarProperties } from "./types";

const defaultOptions: Partial<PolarOptions> = {
    delay: 2000,
    onPoll: (response, actions, properties) => {},
    beforePoll: (actions, properties) => {},
    afterPoll: (actions, properties) => {},
    continueOnError: false
};

export class Polar {

    private options: PolarOptions;
    private stopPoll = false;
    private count = 0;
    private error = null;

    private get properties(): PolarProperties {
        return {
            count: this.count,
            error: this.error
        };
    }

    private get actions(): PolarActions {
        return {
            stop: this.stop,
            updateOptions: this.updateOptions
        }
    }

    public constructor(options: PolarOptions) {
        this.options = {...defaultOptions, ...options};
        this.stop = this.stop.bind(this);
        this.updateOptions = this.updateOptions.bind(this);
    }


    public async start(): Promise<any> {
        // In case stop was called by the afterPoll hook
        if (this.stopPoll) return Promise.resolve();

        try {
            this.beforePoll();
            this.error = null;
            this.count++;
            const r = await this.options.request();
            this.onPoll(r);
            if (this.stopPoll || this.limitReached()) {
                this.afterPoll();
                return r;
            } else {
                this.afterPoll();
                return await this.pollWithDelay();
            }
        } catch(e) {
            this.error = e;
            this.afterPoll();
            if (this.options.continueOnError && !this.limitReached() && !this.stopPoll) {
                return await this.pollWithDelay();
            } else if (!this.options.continueOnError) {
                return Promise.reject(e);
            } else {
                return Promise.resolve();
            }
        }
    }

    public stop() {
        this.stopPoll = true;
    }

    private limitReached(): boolean {
        return this.options.limit && (this.count === this.options.limit);
    }

    private updateOptions(patch: Partial<PolarOptions>) {
        this.options = {...this.options, ...patch};
    }

    private onPoll(request: any) {
        this.options.onPoll(request, this.actions, this.properties);
    }

    private beforePoll() {
        this.options.beforePoll(this.actions, this.properties);
    }

    private afterPoll() {
        this.options.afterPoll(this.actions, this.properties);
    }

    private pollWithDelay(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const a = await this.start();
                return resolve(a);
            }, this.options.delay);
        });
    }
}

