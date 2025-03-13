import { pipe } from 'fp-ts/lib/function.js';

import * as TaskEither from 'fp-ts/lib/TaskEither.js';
import {
  expectLeftReaderTaskEither,
  expectRightReaderTaskEither,
} from 'jest-fp-ts-matchers';
import { withReaderTaskEitherRetry } from './withReaderTaskEitherRetry.ts';
import { RetriesExceededError } from './errors.ts';

describe('withTaskEitherTimeout()', () => {
  it('should not retry the task if it succeeds', () => {
    const retries = 2;
    const run = vi.fn(() => Promise.resolve('success'));
    const rte = () => TaskEither.tryCatch(run, (error) => error);

    return pipe(
      rte,
      withReaderTaskEitherRetry({
        retries,
        // speed up the tests
        minTimeout: 1,
        maxTimeout: 2,
      }),
      expectRightReaderTaskEither((value) => {
        expect(run).toHaveBeenCalledTimes(1);
        expect(value).toStrictEqual('success');
      })
    )({})();
  });

  it('should retry the task and succeed after max retries', () => {
    const retries = 2;
    const run = vi
      .fn()
      .mockRejectedValueOnce(new Error('failed'))
      .mockRejectedValueOnce(new Error('failed'))
      .mockResolvedValueOnce('success');

    const rte = () => TaskEither.tryCatch(run, (error) => error);

    return pipe(
      rte,
      withReaderTaskEitherRetry({
        retries,
        // speed up the tests
        minTimeout: 1,
        maxTimeout: 2,
      }),
      expectRightReaderTaskEither((value) => {
        expect(value).toStrictEqual('success');
        expect(run).toHaveBeenCalledTimes(retries + 1);
      })
    )({})();
  });

  it('should retry the task and fail after max retries', () => {
    const retries = 2;
    const run = vi.fn(() => Promise.reject(new Error('test')));
    const rte = () => TaskEither.tryCatch(run, (error) => error);

    return pipe(
      rte,
      withReaderTaskEitherRetry({
        retries,
        // speed up the tests
        minTimeout: 1,
        maxTimeout: 2,
      }),
      expectLeftReaderTaskEither((err) => {
        expect(err).toBeInstanceOf(RetriesExceededError);
        expect(run).toHaveBeenCalledTimes(retries + 1);
      })
    )({})();
  });
});
