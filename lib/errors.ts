export class TimeoutError extends Error {
  name = 'FpTsTimeoutError' as const;
}

export class RetriesExceededError extends Error {
  name = 'RetriesExceededError' as const;
}

export function isTimeoutError(err: unknown): err is TimeoutError {
  return err instanceof Error && err.name === 'FpTsTimeoutError';
}

export function isRetriesExceededError(
  err: unknown
): err is RetriesExceededError {
  return err instanceof Error && err.name === 'RetriesExceededError';
}
