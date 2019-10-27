'use strict';

const all = require('./');
const {expect} = require('chai');

const STANDARD_WAIT = 50;

describe('promise-all-reject-later', () => { // eslint-disable-line no-undef
  it( // eslint-disable-line no-undef
    'returns a Promise that resolves to an Array when all of the promises in '
      + 'the given iterable have resolved, the Array containing the values '
      + 'to which the promises resolved in the order corresponding the order '
      + 'of the promises in the iterable',
    async () => {
      const returnPromise = all({
        *[Symbol.iterator]() {
          const promises = [
            new Promise(
              resolve => setTimeout(() => resolve('p0'), STANDARD_WAIT * 3),
            ),
            new Promise(
              resolve => setTimeout(() => resolve('p1'), STANDARD_WAIT),
            ),
            new Promise(
              resolve => setTimeout(() => resolve('p2'), STANDARD_WAIT * 2),
            ),
          ];

          for (const promise of promises) yield promise;
        },
      });

      expect(returnPromise).to.be.an.instanceof(Promise);

      const resolvedValues = await returnPromise;

      expect(resolvedValues).to.be.an.instanceof(Array);

      expect(resolvedValues).to.deep.equal([
        'p0',
        'p1',
        'p2',
      ]);
    },
  );

  it( // eslint-disable-line no-undef
    'returns a Promise that resolves to an empty Array if the given iterable '
      + 'is empty',
    async () => {
      const returnPromise = all({
        *[Symbol.iterator]() {},
      });

      expect(returnPromise).to.be.an.instanceof(Promise);

      const resolvedValues = await returnPromise;

      expect(resolvedValues).to.be.an.instanceof(Array);

      expect(resolvedValues).to.deep.equal([]);
    },
  );

  it( // eslint-disable-line no-undef
    'operates on a non-Promise thenable in the given iterable as it would on a '
    + ' Promise',
    async () => {
      const returnPromise = all({
        *[Symbol.iterator]() {
          const promises = [
            new Promise(
              resolve => setTimeout(() => resolve('p0'), STANDARD_WAIT * 3),
            ),
            {
              then(cb) {
                return Promise.resolve(cb('p1'));
              },
            },
            new Promise(
              resolve => setTimeout(() => resolve('p2'), STANDARD_WAIT * 2),
            ),
          ];

          for (const promise of promises) yield promise;
        },
      });

      expect(returnPromise).to.be.an.instanceof(Promise);

      const resolvedValues = await returnPromise;

      expect(resolvedValues).to.be.an.instanceof(Array);

      expect(resolvedValues).to.deep.equal([
        'p0',
        'p1',
        'p2',
      ]);
    },
  );

  it( // eslint-disable-line no-undef
    'passes through a non-Promise non-thenable in the given iterable to the '
      + 'Array which the returned Promise resolves to, in the ordering '
      + 'corresponding to its ordering in the given iterable',
    async () => {
      const value = {};

      const result = await all({
        *[Symbol.iterator]() {
          const elements = [
            new Promise(
              resolve => setTimeout(() => resolve('p0'), STANDARD_WAIT * 2),
            ),
            value,
            new Promise(
              resolve => setTimeout(() => resolve('p2'), STANDARD_WAIT),
            ),
          ];

          for (const element of elements) yield element;
        },
      });

      expect(result).to.deep.equal([
        'p0',
        value,
        'p2',
      ]);

      expect(result[1]).to.equal(value);
    },
  );

  it( // eslint-disable-line no-undef
    'returns a Promise which rejects if any of the promises in the given '
      + "iterable rejects, where the returned Promise's rejection reason is "
      + 'that of the first promise to reject, and where the returned Promise '
      + 'does not reject until all of the promises in the given iterable have '
      + 'resolved or rejected',
    async () => {

      let sideEffect0Occurred;
      const promise0 = new Promise(
        resolve => setTimeout(() => {
          sideEffect0Occurred = true;
          resolve();
        }, STANDARD_WAIT),
      );

      const promise1 = new Promise(
        (resolve, reject) => setTimeout(
          () => reject(new Error('p1')), STANDARD_WAIT * 2,
        ),
      );

      let sideEffect2Occurred;
      const promise2 = new Promise(
        resolve => setTimeout(() => {
          sideEffect2Occurred = true;
          resolve();
        }, STANDARD_WAIT * 3),
      );

      let sideEffect3Occurred;
      const promise3 = new Promise(
        (resolve, reject) => setTimeout(() => {
          sideEffect3Occurred = true;
          reject(new Error('p3'));
        }, STANDARD_WAIT * 4),
      );

      let reason;
      try {
        await all([promise0, promise1, promise2, promise3]);
      }
      catch (e) {
        reason = e;
      }

      expect(reason && reason.message).to.equal('p1');
      expect(sideEffect0Occurred).to.equal(true);
      expect(sideEffect2Occurred).to.equal(true);
      expect(sideEffect3Occurred).to.equal(true);
    },
  );

  // eslint-disable-next-line no-undef
  it('returns a Promise which rejects if not given an argument', async () => {
    const returnPromise = all();

    expect(returnPromise).to.be.an.instanceof(Promise);

    let exception;
    try {
      await returnPromise;
    }
    catch (e) {
      exception = e;
    }

    expect(exception && exception.message).to.match(/is not iterable$/);
  });

  // eslint-disable-next-line no-undef
  it('returns a Promise which rejects if given a non-iterable', async () => {
    const returnPromise = all({});

    expect(returnPromise).to.be.an.instanceof(Promise);

    let exception;
    try {
      await returnPromise;
    }
    catch (e) {
      exception = e;
    }

    expect(exception && exception.message).to.match(/is not iterable$/);
  });

});
