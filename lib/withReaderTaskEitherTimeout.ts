import { pipe } from 'fp-ts/lib/function.js';
import { withTaskEitherTimeout } from './withTaskEitherTimeout.ts';
import type * as ReaderTaskEither from 'fp-ts/lib/ReaderTaskEither.js';
import type { TimeoutError } from './errors.ts';

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
      return pipe(readerTaskEither(deps), withTaskEitherTimeout(milliseconds));
    };
  };
}
