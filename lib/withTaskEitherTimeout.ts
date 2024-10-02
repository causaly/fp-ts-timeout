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
    const asyncTimeout = new Promise<Either.Either<TimeoutError, never>>(
      (resolve) => {
        setTimeout(
          () =>
            resolve(
              Either.left(new TimeoutError(`Timed out after ${milliseconds}ms`))
            ),
          milliseconds
        );
      }
    );
    const asyncTask = taskEither();

    return () => Promise.race([asyncTask, asyncTimeout]);
  };
}
