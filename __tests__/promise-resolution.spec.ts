import { Polar } from "../src/index";

const errMsg = "stubbed err";
const resolvedMsg = "resolved";

describe("How the polling promise chain hands off the result.", () => {
    test("The poll should return a resolved message on finish when manually stopped.", () => {
        return new Polar({
            request: jest.fn(() => Promise.resolve(resolvedMsg)),
            onPoll: (r, a) => {
                if (r === resolvedMsg) a.stop();
            }
        })
            .start()
            .then(res => {
                expect(res).toEqual(resolvedMsg);
            });
    });

    test("The poll should return a resolved message on finish when stopped through limit.", () => {
        return new Polar({
            request: jest.fn(() => Promise.resolve(resolvedMsg)),
            delay: 100,
            limit: 2
        })
            .start()
            .then(res => {
                expect(res).toEqual(resolvedMsg);
            });
    });

    test("The poll should exit on the request error and hand the error message to catch.", () => {
        const p = new Polar({
            request: jest.fn(() => Promise.reject(errMsg))
        });
        expect(p.start()).rejects.toMatch(errMsg);
    });

    test("The poll should hand off the error message to catch when continueOnUpdate is set.", () => {
        const p = new Polar({
            request: jest.fn(() => Promise.reject(errMsg)),
            continueOnUpdate: true
        });
        expect(p.start()).rejects.toMatch(errMsg);
    });
});
