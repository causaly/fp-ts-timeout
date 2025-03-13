import pRetry from 'p-retry';
import * as TaskEither from 'fp-ts/lib/TaskEither.js';
import { identity, pipe } from 'fp-ts/lib/function.js';
import { RetriesExceededError } from './errors.ts';
import type { Options } from 'p-retry';

export const withTaskEitherRetry =
  (options?: Options) =>
  <LeftType, RightType>(
    taskEither: TaskEither.TaskEither<LeftType, RightType>
  ): TaskEither.TaskEither<RetriesExceededError, RightType> => {
    // Convert task either to a throwable task
    // to let p-retry catch the errors
    const task = pipe(
      taskEither,
      TaskEither.match((err) => {
        throw err;
      }, identity)
    );

    return TaskEither.tryCatch(
      () => pRetry(task, options),
      (err) =>
        new RetriesExceededError('Retry attempts exceeded', { cause: err })
    );
  };
