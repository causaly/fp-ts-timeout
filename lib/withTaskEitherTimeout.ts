import * as Either from 'fp-ts/lib/Either.js';
import { pipe } from 'fp-ts/lib/function.js';
import * as TaskEither from 'fp-ts/lib/TaskEither.js';

import { TimeoutError } from './errors.ts';

const TIMEOUT_SYMBOL = Symbol('TimeoutReturnValue');

type TaskEitherWithTimeoutCurriedFunc<LeftType, RightType> = (
  taskEither: TaskEither.TaskEither<LeftType, RightType>
) => TaskEither.TaskEither<TimeoutError | LeftType, RightType>;

export function withTaskEitherTimeout<LeftType, RightType>(
  milliseconds: number
): TaskEitherWithTimeoutCurriedFunc<LeftType, RightType> {
  return (taskEither) => {
    const asyncTimeout = new Promise<typeof TIMEOUT_SYMBOL>((resolve) => {
      setTimeout(() => resolve(TIMEOUT_SYMBOL), milliseconds);
    });
    const asyncTask = taskEither();

    return pipe(
      () => Promise.race([asyncTask, asyncTimeout]),
      TaskEither.fromTask,
      TaskEither.flatMapEither((res) => {
        if (res === TIMEOUT_SYMBOL) {
          return Either.left<TimeoutError | LeftType>(
            new TimeoutError(`TaskEither timed out after ${milliseconds}ms`)
          );
        }

        return res;
      })
    );
  };
}
