# polar
 A tiny flexible JS polling library with typescript support.
 
## Installation

`npm install js-polar`

## Getting Started
 
 ```js
import { Polar } from "js-polar";

const polar = new Polar({
    delay: 1000,
    request: () => fetch("https://github.com"),
    onPoll: (response, actions, properties) => {
        // Handle polling logic
    }
});

polar.start()
    .catch(myHandleErrFunction)
```

---

### Constructor Options

| Name       | Description  | Default
| ------------- |:-------------|:------------- |
| request      | The poll request. | None (required) |
| beforePoll | Lifecycle method to execute before attempting each poll. | () => {} |
| onPoll | Lifecycle method to execute upon each successful poll. | () => {} |
| afterPoll | Lifecycle method to execute after attempting each poll. | () => {} |
| delay      | Delay in ms between each poll. | 2000 |
| limit      | Maximum number of polls before stopping. | null (no limit) |
| continueOnError (*)      | Continue polling when an error response is received. | false |

\* Note that if `continueOnError` is `true`, any `catch` block attached to the
`polar.start()` call will not pick up errors. Instead, the error can be accessed
via `properties.error` inside the lifecycle methods.

---

### Lifecycle Parameters

Below are type definitions for lifecycle methods:

`beforePoll: (response, actions, properties) => void`

`onPoll: (actions, properties) => void`

`afterPoll: (actions, properties) => void`

#### response

The response object returned by the most recent poll.

#### actions

An object containing actions which allow the user to stop the poll process
or update the initial poll parameters from within lifecycle methods. These are `actions.stop` and `actions.updateOptions`, respectively.

For example, the following polls until there's
a `completed` property in the response body:

```js
new Polar({
    request: () => fetch("https://github.com"),
    onPoll: (response, actions, properties) => {
        if (response.body.completed) {
            actions.stop();
        }
    }
}).start();
```

In the next example, the endpoint is polled five times with the
delay being doubled after each poll.

```js
let delay = 1000;

new Polar({
    request: () => fetch("https://github.com"),
    delay,
    limit: 5,
    afterPoll: (actions, properties) => {
        delay *= 2;
        actions.updateOptions({ delay });
    }
}).start();
```

#### properties

This object contains two values. 

`properties.count` gives 
the number of requests in the lifetime of the polling process.

`properties.error` contains the the error caught in the previous poll attempt,
defaulting to `null` if there are none. This value is useful if you've set
`continueOnError` to `true` and still want to track errors, otherwise any errors
can just be caught in a `catch` block chained to `Polar.start()`.

<b>Note</b>: the `error` value returned inside `onPoll` also refers
to the <i>previous</i> poll attempt. This is because `onPoll` isn't called
on error. It may be better to restrict error handling to the `beforePoll` and `afterPoll`
methods to avoid confusion.
