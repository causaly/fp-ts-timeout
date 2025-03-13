# fp-ts-timeout

Timeout functionality for fp-ts async structures.

[![Build Status](https://github.com/causaly/fp-ts-timeout/actions/workflows/ci.yml/badge.svg)](https://github.com/causaly/fp-ts-timeout/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/fp-ts-timeout.svg?color=0c0)](https://www.npmjs.com/package/fp-ts-timeout)

## Installation

```bash
npm install fp-ts-timeout
```

#### Requirements

- Node.js v.18+
- TypeScript v.4.5+

## API

- [withTaskEitherTimeout(number)](#withtaskeithertimeout)
- [withReaderTaskEitherTimeout(number)](#withreadertaskeithertimeout)
- [TimeoutError](#timeouterror)
- [withTaskEitherRetry(options)](#withreadertaskeitherretry)
- [withReaderTaskEitherRetry(options)](#withreadertaskeitherretry)

### withTaskEitherTimeout

A higher-order function for setting a timeout on asynchronous operations.

#### Example

```typescript
import * as Either from 'fp-ts/Either';
import * as TaskEither from 'fp-ts/TaskEither';
import { withTaskEitherTimeout, isTimeoutError } from 'fp-ts-timeout';

pipe(
  TaskEither.tryCatch(
    () => {
      // some async operation
    }),
    Either.toError
  ),
  withTaskEitherTimeout(1000) // 1 second timeout
  TaskEither.match(
    (error) => {
      if (isTimeoutError(error)) {
        // handle timeout error
      } else {
        // handle other errors
      }
    },
    (result) => {
      // handle success
    }
)
```

### withReaderTaskEitherTimeout

A higher-order function for setting a timeout on asynchronous operations.

#### Example

```typescript
import * as Either from 'fp-ts/Either';
import * as TaskEither from 'fp-ts/TaskEither';
import * as ReaderTaskEither from 'fp-ts/ReaderTaskEither';
import { withTaskEitherTimeout, isTimeoutError } from 'fp-ts-timeout';

pipe(
  TaskEither.tryCatch(
    () => {
      // some async operation
    }),
    Either.toError
  ),
  ReaderTaskEither.fromTaskEither,
  withReaderTaskEitherTimeout(1000), // 1 second timeout
  TaskEither.match(
    (error) => {
      if (isTimeoutError(error)) {
        // handle timeout error
      } else {
        // handle other errors
      }
    },
    (result) => {
      // handle success
    }
)
```

### TimeoutError

Custom error thrown when an asynchronous operation exceeds the defined timeout limit.

### withTaskEitherRetry

A higher-order function for retrying asynchronous operations, utilizing [p-retry](https://www.npmjs.com/package/p-retry) under the hood. Refer to the package documentation for available [options](https://github.com/sindresorhus/p-retry?tab=readme-ov-file#options) and details.

#### Example

```typescript
import * as Either from 'fp-ts/Either';
import * as TaskEither from 'fp-ts/TaskEither';
import { withTaskEitherRetry } from 'fp-ts-timeout';

pipe(
  TaskEither.tryCatch(
    () => {
      // some async operation
    }),
    Either.toError
  ),
  withTaskEitherRetry({ retries: 2 }),
  TaskEither.match(
    (error) => {
      // handle errors
    },
    (result) => {
      // handle success
    }
)
```

### withReaderTaskEitherRetry

A higher-order function for retrying asynchronous operations, utilizing [p-retry](https://www.npmjs.com/package/p-retry) under the hood. Refer to the package documentation for available [options](https://github.com/sindresorhus/p-retry?tab=readme-ov-file#options) and details.

#### Example

```typescript
import * as Either from 'fp-ts/Either';
import * as TaskEither from 'fp-ts/TaskEither';
import * as ReaderTaskEither from 'fp-ts/ReaderTaskEither';
import { withReaderTaskEitherRetry } from 'fp-ts-timeout';

pipe(
  TaskEither.tryCatch(
    () => {
      // some async operation
    }),
    Either.toError
  ),
  ReaderTaskEither.fromTaskEither,
  withReaderTaskEitherRetry({ retries: 2 }),
  TaskEither.match(
    (error) => {
      // handle errors
    },
    (result) => {
      // handle success
    }
)
```


## Contribute

Source code contributions are most welcome. Please open a PR, ensure the linter is satisfied and all tests pass.

#### We are hiring

Causaly is building the world's largest biomedical knowledge platform, using technologies such as TypeScript, React and Node.js. Find out more about our openings at https://apply.workable.com/causaly/.

## License

MIT
