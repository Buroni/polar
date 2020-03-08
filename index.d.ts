import { PolarActions, PolarOptions, PolarProperties } from "./src/types";

declare module "js-polar" {
    export class Polar {
        constructor(options: PolarOptions);
        start(): Promise<void>;
        stop(): void;
    }
}
