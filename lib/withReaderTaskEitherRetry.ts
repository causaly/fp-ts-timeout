import { withTaskEitherRetry } from './withTaskEitherRetry.ts';
import type * as ReaderTaskEither from 'fp-ts/lib/ReaderTaskEither.js';
import type { RetriesExceededError } from './errors.ts';
import type { Options } from 'p-retry';

export const withReaderTaskEitherRetry =
  (options?: Options) =>
  <DependencyType, LeftType, RightType>(
    rte: ReaderTaskEither.ReaderTaskEither<DependencyType, LeftType, RightType>
  ): ReaderTaskEither.ReaderTaskEither<
    DependencyType,
    RetriesExceededError,
    RightType
  > =>
  (env: DependencyType) =>
    withTaskEitherRetry(options)(rte(env));
