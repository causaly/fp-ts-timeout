import * as Either from 'fp-ts/lib/Either.js';
import { TimeoutError } from './errors.ts';
import type * as TaskEither from 'fp-ts/lib/TaskEither.js';

type TaskEitherWithTimeoutCurriedFunc<LeftType, RightType> = (
  taskEither: TaskEither.TaskEither<LeftType, RightType>
) => TaskEither.TaskEither<TimeoutError | LeftType, RightType>;

export function withTaskEitherTimeout<LeftType, RightType>(
  milliseconds: number
): TaskEitherWithTimeoutCurriedFunc<LeftType, RightType> {
  return (taskEither) => {
    // store the timeout id so that we can clear it later
    let timeoutId: number | undefined;

    const asyncTimeout = new Promise<Either.Either<TimeoutError, never>>(
      (resolve) => {
        // We know or a fact that setTimeout() returns a positive integer.
        // However typescript thinks it returns a NodeJS.Timeout,
        // which is likely coming from a misconfiguration in the tsconfig.
        // I do not have the time to look at this into detail,
        // so I will just ignore the error for now.
        // @ts-expect-error
        timeoutId = setTimeout(
          () =>
            resolve(
              Either.left(new TimeoutError(`Timed out after ${milliseconds}ms`))
            ),
          milliseconds
        );
      }
    );
    const asyncTask = taskEither();

    return () =>
      Promise.race([asyncTask, asyncTimeout]).finally(() => {
        // at this point there's two possibilities:
        // 1. asyncTask has resolved, in which case asyncTimeout is still running
        // 2. asyncTimeout has resolved, in which case asyncTask is still running
        // we want to clear the timeout in both cases
        clearTimeout(timeoutId);
      });
  };
}
