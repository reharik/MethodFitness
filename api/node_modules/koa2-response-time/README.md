# koa2-response-time

[![npm-v-badge][npm-v-badge]][npm-url] [![coverge-badge][coverge-badge]][coverge-url] [![npm-v-badge][npm-v-badge]][npm-url] [![npm-prod-badge][npm-prod-badge]][npm-url] [![npm-dev-badge][npm-dev-badge]][npm-url]

```text
Add response time in response header. It's for koa2 middleware written in ES7 asnyc/await.
```

##Installation

```bash
$ npm install koa2-response-time
```

## Usage & Example

Import default module style:
```javascript
import * as Koa from "koa";
import responseTime from 'koa2-response-time';  // import default style

const app = new Koa();
app.use(responseTime())
```

Import the module style:
```javascript
import * as Koa from "koa";
import { responseTime } from 'koa2-response-time';  // import default style

const app = new Koa();
app.use(responseTime())
```

[coverge-badge]: https://api.travis-ci.org/TonyPythoneer/koa2-response-time.svg?branch=master
[coverge-url]: no

[npm-v-badge]: https://img.shields.io/npm/v/koa2-response-time.svg
[npm-dt-badge]: https://img.shields.io/npm/dt/koa2-response-time.svg
[npm-prod-badge]: https://img.shields.io/david/tonypythoneer/koa2-response-time.svg
[npm-dev-badge]: https://img.shields.io/david/dev/tonypythoneer/koa2-response-time.svg
[npm-url]: https://img.shields.io/npm/dt/koa2-response-time.svg
