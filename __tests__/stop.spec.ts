import { Polar } from "../src/index";

const resolvedMsg = "resolved";

describe("Stopping the poll from outside the process.", () => {
    test("The poll should stop when Polar.stop() is called.", () => {
        const p = new Polar({
            request: jest.fn(() => Promise.resolve(resolvedMsg))
        });

        const pollProcess = p.start();

        p.stop();

        return pollProcess.then(res => {
            expect(res).toEqual(resolvedMsg);
        });
    });
});
