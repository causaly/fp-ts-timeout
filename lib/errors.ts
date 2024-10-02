export class TimeoutError extends Error {
  name = 'FpTsTimeoutError' as const;
}

export function isTimeoutError(err: unknown): err is TimeoutError {
  return err instanceof Error && err.name === 'FpTsTimeoutError';
}
