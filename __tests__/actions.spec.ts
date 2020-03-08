import { Polar } from "../src/index";

describe("Testing actions", () => {
  test("The poll should exit on 'complete' response", () => {
    const requests = [
        jest.fn(() => Promise.resolve({ status: "running" })),
        jest.fn(() => Promise.resolve({ status: "complete" })),
        jest.fn(() => Promise.resolve({ status: "running" }))
    ];
    let count = 0;
    return new Polar({
        request: requests[0],
        limit: 3,
        delay: 100,
        onPoll: (response, actions) => {
            if (response.status === "complete") {
                actions.stop();
            }
            count++;
            actions.updateOptions({ request: requests[count] });
        }
    }).start().then(() => {
        expect(count).toEqual(2);
    });
  });
});
