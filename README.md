# Gayify's backend.

This is the backend for [Gayify](https://github.com/Sof1dev/gayify).
This codebase is meant to run on AWS and needs additional tweaking to run locally.

# How to run locally
- First install the dependencies, this project uses Bun but you can use any package manager

```
bun install
```
NOTE: the dependency `sharp` may need some additional libraries if you're on linux, check this [guide](https://sharp.pixelplumbing.com/install) if you have any problems.


- Change your CORS origin to your API server (defaults to `http://localhost:3000`)

### For NodeJS

Replace the end of the file 

```js
export const handler = handle(app);
```

with:

```js
import { serve } from '@hono/node-server'
serve(app)
```

### For Bun

Replace the end of the file 

```js
export const handler = handle(app);
```

with:

```js
export default app
```


Finally, you can run the `src/index.js` with bun or node.