'use strict';

//     promise-all-reject-later 1.0.0
//     https://github.com/raymond-lam/promise-all-reject-later
//     (c) 2018 Raymond Lam
//
//     Author: Raymond Lam (ray@lam-ray.com)
//
//     promise-all-reject-later may be freely distributed under the MIT license

// Like Promise.all(), returns a single Promise that resolves when all of the
// promises in the given iterable have resolved or when the given iterable
// contains no promises. The returned Promise resolves to an array corresponding
// to the resolved values of the promises in the given iterable, and if any of
// the elements in the iterable are not Promises (or do not have a .then()
// method) then those elements are treated as though they are wrapped in
// Promise.resolve(). Unlike with Promise.all(), however, the returned Promise
// rejects with the reason of the first promise that rejects after all of the
// promises have either resolved or rejected, rather than immediately.
module.exports = async promises => {
  let exceptionWasCaught = false;
  let exception;
  const values = [];

  // As in Promise.all(), throws an exception if promises is not iterable.
  for (const promise of promises) {
    try {
      // If promise rejects or has already rejected, the rejection reason
      // becomes the exception which is caught here. This will cause values not
      // to contain enough elements, which is okay since an values is never
      // returned if any of the promises rejects anyhow. If promise resolves
      // or has already resolved, the resolve value is pushed onto the values
      // array in the correct ordering. The promises resolve or reject on their
      // own asynchronously -- the await-in-a-loop does not in any way serialize
      // or synchronize their execution. The await-in-a-loop's simply puts the
      // resolution values of the promises into the values array in the correct
      // order.
      values.push(await promise);
    }
    catch (e) {
      // Use a separate boolean to indicate whether an exception hass been
      // thrown rather than checking for the defined-ness of exception, because
      // the thrown exception could theoretically be undefined.
      if (!exceptionWasCaught) {
        exceptionWasCaught = true;

        // We only need to track the first exception that is thrown.
        exception = e;
      }
    }
  }

  // If there was an exception, re-throw it only after all the promises have
  // resolved or rejected. async functions always return a Promise, and throwing
  // an exception is equivalent to rejecting, while returning is equivalent to
  // resolving.
  if (exceptionWasCaught) throw exception;
  else return values;
};
