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

### Constructor Options


| Name       | Description  | Default
| ------------- |:-------------|:------------- |
| request      | The poll request. | None (required) |
| onPoll | Function to execute after each poll. | () => {} |
| delay      | Delay in ms between each poll. | 2000 |
| limit      | Maximum number of polls before stopping. | null (no limit) |
| continueOnError      | Continue polling when an error response is received. | false |

