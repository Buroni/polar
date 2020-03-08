import { PolarActions, PolarOptions, PolarProperties } from "./src/types";

declare module "js-polar" {
    class Polar {
        constructor(options: PolarOptions);
    }
}
