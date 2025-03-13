import { withTaskEitherRetry } from './withTaskEitherRetry.ts';
import type * as ReaderTaskEither from 'fp-ts/lib/ReaderTaskEither.js';
import type { Options } from 'p-retry';

export const withReaderTaskEitherRetry =
  (options?: Options) =>
  <DependencyType, LeftType, RightType>(
    rte: ReaderTaskEither.ReaderTaskEither<DependencyType, LeftType, RightType>
  ): ReaderTaskEither.ReaderTaskEither<DependencyType, LeftType, RightType> =>
  (env: DependencyType) =>
    withTaskEitherRetry(options)(rte(env));
