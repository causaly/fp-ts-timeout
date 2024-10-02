import { pipe } from 'fp-ts/function';
import * as Task from 'fp-ts/Task';
import * as TaskEither from 'fp-ts/TaskEither';
import {
  expectLeftTaskEither,
  expectRightTaskEither,
} from 'jest-fp-ts-matchers';
import { withTaskEitherTimeout } from './withTaskEitherTimeout.ts';
import { TimeoutError } from './errors.ts';

describe('withTaskEitherTimeout()', () => {
  it('returns a timeout error when taskEither takes too long', () => {
    const timeoutMs = 50;

    return pipe(
      Task.of(null),
      Task.delay(2 * timeoutMs),
      TaskEither.fromTask,
      withTaskEitherTimeout(timeoutMs),
      expectLeftTaskEither((err) => {
        expect(err).toBeInstanceOf(TimeoutError);
      })
    )();
  });

  it('returns the result of taskEither when it completes before the timeout', () => {
    const timeoutMs = 50;
    const result = 'Hello, World!';

    return pipe(
      Task.of(result),
      TaskEither.fromTask,
      withTaskEitherTimeout(timeoutMs),
      expectRightTaskEither((res) => {
        expect(res).toBe(result);
      })
    )();
  });

  it('returns error when taskEither fails before the timeout', () => {
    const timeoutMs = 50;
    const error = new Error('Something went wrong');

    return pipe(
      TaskEither.left(error),
      withTaskEitherTimeout(timeoutMs),
      expectLeftTaskEither((err) => {
        expect(err).toBe(error);
      })
    )();
  });
});
