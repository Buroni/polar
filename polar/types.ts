export type PolarProperties = {
    error: any,
    count: number
};

export type PolarActions = {
    stop: () => void,
    updateOptions: (patch: Partial<PolarOptions>) => void
}

export type PolarOptions = {
    request: () => Promise<any>;
    delay?: number;
    onPoll?: (response: any, actions: PolarActions, properties: PolarProperties) => void
    limit?: number;
    continueOnError: boolean;
};
