import { pipe } from 'fp-ts/function';
import * as ReaderTaskEither from 'fp-ts/ReaderTaskEither';
import * as Task from 'fp-ts/Task';
import * as TaskEither from 'fp-ts/TaskEither';
import {
  expectLeftReaderTaskEither,
  expectRightReaderTaskEither,
} from 'jest-fp-ts-matchers';
import { withReaderTaskEitherTimeout } from './withReaderTaskEitherTimeout.ts';
import { TimeoutError } from './errors.ts';

describe('withReaderTaskEitherTimeout()', () => {
  it('returns a timeout error when readerTaskEither takes too long', () => {
    const timeoutMs = 50;

    return pipe(
      Task.of(null),
      Task.delay(2 * timeoutMs),
      ReaderTaskEither.fromTask,
      withReaderTaskEitherTimeout(timeoutMs),
      expectLeftReaderTaskEither((err) => {
        expect(err).toBeInstanceOf(TimeoutError);
      })
    )({})();
  });

  it('returns the result of readerTaskEither when it completes before the timeout', () => {
    const timeoutMs = 50;
    const result = 'Hello, World!';

    return pipe(
      Task.of(result),
      ReaderTaskEither.fromTask,
      withReaderTaskEitherTimeout(timeoutMs),
      expectRightReaderTaskEither((res) => {
        expect(res).toBe(result);
      })
    )({})();
  });

  it('returns error when readerTaskEither fails before the timeout', () => {
    const timeoutMs = 50;
    const error = new Error('Something went wrong');

    return pipe(
      ReaderTaskEither.left(error),
      withReaderTaskEitherTimeout(timeoutMs),
      expectLeftReaderTaskEither((err) => {
        expect(err).toBe(error);
      })
    )({})();
  });

  it('throws if the readerTaskEither throws before the timeout', async () => {
    const timeoutMs = 50;
    const funcThatRejects = () => {
      return Promise.reject(new Error('Something went wrong'));
    };

    try {
      await pipe(
        TaskEither.tryCatch(funcThatRejects, () => {
          throw new Error('Unexpected error');
        }),
        ReaderTaskEither.fromTaskEither,
        withReaderTaskEitherTimeout(timeoutMs)
      )({})();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe('Unexpected error');
    }
  });

  it('returns a timeout error if the readerTaskEither throws after the timeout', async () => {
    const timeout = 50;
    const funcThatRejects = () => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Something went wrong'));
        }, 2 * timeout);
      });
    };

    return pipe(
      TaskEither.tryCatch(funcThatRejects, () => {
        throw new Error('Unexpected error');
      }),
      ReaderTaskEither.fromTaskEither,
      withReaderTaskEitherTimeout(timeout),
      expectLeftReaderTaskEither((err) => {
        expect(err).toBeInstanceOf(TimeoutError);
      })
    )({})();
  });
});
