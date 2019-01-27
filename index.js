'use strict';

//     promise-all-reject-later 1.0.1
//     https://github.com/raymond-lam/promise-all-reject-later
//     (c) 2018-2019 Raymond Lam
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
module.exports = promises => {
  let error;
  const handler = reason => (error = error || reason);
  const promisesWithHandler = [];
  try {
    for (const p of promises) {
      promisesWithHandler.push(p.then && p.catch ? p.catch(handler) : p);
    }

    // All the promises have a catch handler, so Promise.all() will not reject
    // prematurely if any of the underlying promises reject. The catch handler
    // will save the first error that happens, and the then callback will
    // execute after all the underlying promises have either resolved or
    // rejected, and check if any of them have rejected, before causing the
    // aggregate promise to resolve or reject accordingly.
    return Promise.all(promisesWithHandler).then(
      values => {
        if (error) throw error;
        else return values;
      }
    );
  }
  catch (e) {
    return Promise.reject(e);
  }
};
