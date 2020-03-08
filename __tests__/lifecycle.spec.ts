import Polar from "../src/index";
const errMsg = "stubbed err";

const genParams = () => ({
    i: 0,
    count: undefined,
    errors: []
});

const requests = [
    jest.fn(() => Promise.reject(errMsg)),
    jest.fn(() => Promise.resolve()),
];

describe("Testing lifecycles", () => {
    test("beforePoll", () => {
        const params = genParams();
        return new Polar({
            request: requests[0],
            delay: 100,
            continueOnError: true,
            beforePoll: (a, p) => {
                params.errors.push(p.error);
                params.count = p.count;
                a.updateOptions({ request: requests[params.i++] });
                if (p.count === 1) a.stop();
            },
        }).start().then(() => {
            expect(params.count).toEqual(1);
            expect(params.errors[0]).toEqual(null);
            expect(params.errors[1]).toEqual(errMsg);
            expect(params.errors.length).toEqual(2);
        });
    });

    test("onPoll", () => {
        const params = genParams();
        return new Polar({
            request: requests[0],
            delay: 100,
            continueOnError: true,
            onPoll: (_, a, p) => {
                params.errors.push(p.error);
                params.count = p.count;
                if (p.count === 2) a.stop();
            },
            afterPoll: (a, p) => {
                a.updateOptions({ request: requests[++params.i] });
            },
        }).start().then(() => {
            expect(params.count).toEqual(2);
            expect(params.errors[0]).toEqual(null);
            expect(params.errors.length).toEqual(1);
        });
    });

    test("afterPoll", () => {
        const params = genParams();
        return new Polar({
            request: requests[0],
            delay: 100,
            continueOnError: true,
            afterPoll: (a, p) => {
                params.errors.push(p.error);
                params.count = p.count;
                a.updateOptions({ request: requests[++params.i] });
                if (p.count === 2) a.stop();
            },
        }).start().then(() => {
            expect(params.count).toEqual(2);
            expect(params.errors[0]).toEqual(errMsg);
            expect(params.errors[1]).toEqual(null);
            expect(params.errors.length).toEqual(2);
        });
    });
});
