# value-censorship

This is a way to run untrusted code by censoring every value that's ever called or passed to a function call. It also prevents from using catch statements (try...finally is still allowed). If your untrusted code can't call unsafe functions, there's not much it can do. Use together with [VM2](https://npmjs.com/vm2) or AdSafe.

Since it censors practically every possibility of breaking out of the VM, it's an effective way to secure unsafe code provided you use it with VM2 for isolation or AdSafe for syntax censorship.

## Example

```js
const censor = require('value-censorship')

censor(`
  global["eva" + "l"]("42")  // Throws CensorStop error
  global["Functio" + "n"]("42")  // Throws CensorStop error
  new (function(){}.constructor)("42")  // Throws CensorStop error
`)
```
