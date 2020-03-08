import { PolarActions, PolarOptions, PolarProperties } from "./src/types";

declare module "js-polar" {
    export default class Polar {
        constructor: (options: PolarOptions): void;
    }
}
