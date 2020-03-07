export type PolarOptions = {
    request: () => Promise<any>;
    delay?: number;
    onPoll?: (response: any, stop: () => void, error?: any) => void
    limit?: number;
    continueOnError: boolean;
};
