# polar
 A tiny flexible JS polling library.
 
 ```js
const Polar = require("polar-js")

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
| onPoll | Function to execute after each poll. | () => {} |
| delay      | Delay in ms between each poll. | 2000 |
| limit      | Maximum number of polls before stopping. | null (no limit) |
| continueOnError (*)      | Continue polling when an error response is received. | false |

\* Note that if `continueOnError` is `true`, any `catch` block attached to the
`polar.start()` call will not pick up errors. Instead, the error can be accessed
via `properties.error` inside the `onPoll` function.

---

### onPoll Parameters

#### response

The response object returned by the most recent poll.

#### actions

An object containing actions which allow the user to stop the poll process
or update the initial poll parameters from within `onPoll`. These are `actions.stop` and `actions.updateOptions`, respectively.

For example, the following stops the poll process if there's
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
delay being doubled each time.

```js
let delay = 1000;

new Polar({
    request: () => fetch("https://github.com"),
    delay,
    limit: 5,
    onPoll: (response, actions, properties) => {
        delay *= 2;
        actions.updateProperties({ delay });
    }
}).start();
```

#### properties

This object contains two values. 

`properties.count` gives 
the number of requests in the lifetime of the polling process.

`properties.error` contains the the error caught in the most recent poll,
defaulting to `null` if there are none. This value is useful if you've set
`continueOnError` to `true` and still want to track errors, otherwise any errors
can just be caught in a `catch` block chained to `Polar.start()`.
