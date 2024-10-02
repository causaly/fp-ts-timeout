import * as Either from 'fp-ts/lib/Either.js';
import { pipe } from 'fp-ts/lib/function.js';
import * as TaskEither from 'fp-ts/lib/TaskEither.js';
import { TimeoutError } from './errors.ts';
import type * as ReaderTaskEither from 'fp-ts/lib/ReaderTaskEither.js';

const TIMEOUT_SYMBOL = Symbol('TimeoutReturnValue');

type ReaderTaskEitherWithTimeoutCurriedFunc<
  DependencyType,
  LeftType,
  RightType
> = (
  readerTaskEither: ReaderTaskEither.ReaderTaskEither<
    DependencyType,
    LeftType,
    RightType
  >
) => ReaderTaskEither.ReaderTaskEither<
  DependencyType,
  TimeoutError | LeftType,
  RightType
>;

export function withReaderTaskEitherTimeout<
  DependencyType,
  LeftType,
  RightType
>(
  milliseconds: number
): ReaderTaskEitherWithTimeoutCurriedFunc<DependencyType, LeftType, RightType> {
  return (readerTaskEither) => {
    return (deps: DependencyType) => {
      const asyncTimeout = new Promise<typeof TIMEOUT_SYMBOL>((resolve) => {
        setTimeout(() => resolve(TIMEOUT_SYMBOL), milliseconds);
      });
      const asyncTask = readerTaskEither(deps)();

      return pipe(
        () => Promise.race([asyncTask, asyncTimeout]),
        TaskEither.fromTask,
        TaskEither.flatMapEither((res) => {
          if (res === TIMEOUT_SYMBOL) {
            return Either.left<TimeoutError | LeftType>(
              new TimeoutError(
                `ReaderTaskEither timed out after ${milliseconds}ms`
              )
            );
          }

          return res;
        })
      );
    };
  };
}
