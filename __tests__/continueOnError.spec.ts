import { Polar } from "../src/index";

const errMsg = "stubbed err";

describe("Polling with errors", () => {
    test("The poll should continue on the request error", () => {
        const errs = [];
        const requests = [
            jest.fn(() => Promise.reject(errMsg)),
            jest.fn(() => Promise.resolve())
        ];
        return new Polar({
            request: requests[0],
            continueOnError: true,
            delay: 100,
            limit: 2,
            afterPoll: (actions, props) => {
                errs.push(props.error);
                actions.updateOptions({ request: requests[1] });
            }
        })
            .start()
            .then(() => {
                expect(errs[0]).toEqual(errMsg);
                expect(errs[1]).toEqual(null);
            });
    });
});
