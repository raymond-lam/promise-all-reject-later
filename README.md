promise-all-reject-later
========================

[![Build Status](https://travis-ci.com/raymond-lam/promise-all-reject-later.svg?branch=master)](https://travis-ci.com/raymond-lam/promise-all-reject-later)
[![Greenkeeper badge](https://badges.greenkeeper.io/raymond-lam/promise-all-reject-later.svg)](https://greenkeeper.io/)

A drop-in replacement for `Promise.all()` which does not fail-fast.

Like [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), `promise-all-reject-later` returns a single, aggregate [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves when all of the promises (or any object with a `.then()` method) in the given iterable argument have resolved or when it is empty. (Anything in the iterable that is not a Promise or does not have a `.then()` method will be operated upon as if it were wrapped in [`Promise.resolve()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve).) The resolution value is an [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of the resolution values of the promises in the iterable argument.

However, whereas the Promise returned by `Promise.all()` rejects as soon as any one of the given promises rejects (the so-called "[fail-fast behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#Promise.all_fail-fast_behaviour)"), if any of the promises given to `promise-all-reject-later` rejects, the returned Promise will reject only after all of the promises have resolved or rejected. (The rejection reason will be that of the first promise to reject.)

When the aggregate Promise returned by `Promise.all()` rejects, it loses track of the promises which have not yet resolved or rejected. These promises will still eventually resolve or reject, but the "fail fast" behavior makes it difficult to sequence the execution of code after these pending promises. `promise-all-reject-later` makes it easy to sequence code after an entire set of promises, whether or not any such promise ends up rejecting.

## Usage

```javascript
const all = require('promise-all-reject-later');

const promise0 = new Promise( ... );
const promise1 = new Promise( ... );
const promise2 = new Promise( ... );

all([
  promise0,
  promise1,
  promise2,
]).catch(
  reason => {
    /*
      If any of the promises reject, this callback will be called after all of
      the promises have resolved or rejected. reason will be the rejection
      reason of the first promise that was rejected.
    */
  }
);
```

## Author

Raymond Lam (ray@lam-ray.com)

## License

MIT
