import { Polar } from "../src/index";

const errMsg = "stubbed err";

describe("Testing maxRetries", () => {
    test("The poll should retry once", () => {
        let count = 0;
        return new Polar({
            request: jest.fn(() => Promise.reject(errMsg)),
            delay: 100,
            maxRetries: 1,
            afterPoll: () => count++
        })
            .start()
            .catch(() => {
                expect(count).toEqual(2);
            });
    });
});
