import { Polar } from "../src/index";

describe("Testing properties", () => {
    test("Limit: the poll should exit after 3 requests", () => {
        let count = 0;
        return new Polar({
            request: jest.fn(() => Promise.resolve()),
            limit: 3,
            delay: 100,
            onPoll: () => count++
        })
            .start()
            .then(() => {
                expect(count).toEqual(3);
            });
    });
});
