# @medishn/gland-qiu

[![NPM Version](https://img.shields.io/npm/v/@medishn/gland-qiu.svg)](https://www.npmjs.com/package/@medishn/gland-qiu)
[![License](https://img.shields.io/npm/l/@medishn/gland-qiu.svg)](LICENSE)

`@medishn/gland-qiu` is a flexible and efficient database management tool that handles PostgreSQL, MySQL, and MariaDB queries. The package provides powerful caching, rate-limiting, and task management functionalities for database operations.

## Features

- **Multi-database Support**: PostgreSQL, MySQL, and MariaDB.
- **Rate Limiting**: Ensures controlled execution of tasks with custom rate-limits.
- **Task Management**: Queue-based task execution system for managing multiple queries.
- **Cache Management**: In-memory caching system to reuse frequently used commands and reduce overhead.
- **File-based Query Execution**: Supports SQL queries from `.sql` files.

## Installation

Install the package using npm:

```bash
npm install @medishn/gland-qiu
```

## Getting Started

Below is an example of how to use the `Qiu` class to run database queries:

### Initialization

To begin using `Qiu`, you need to initialize it with your database type and connection string.

```typescript
import { Qiu } from '@medishn/gland-qiu';

const db = new Qiu('pg', 'postgresql://username:password@localhost:5432/mydatabase');
```

You can also specify MySQL or MariaDB:

```typescript
const db = new Qiu('mysql', 'mysql://username:password@localhost:3306/mydatabase');
```

### Select a Database

You can switch between databases by calling the `use` method.

```typescript
db.use('mydatabase');
```

### Execute a Query

#### Simple Query

To execute a simple SQL query, use the `exec` method.

```typescript
await db.exec('SELECT * FROM users;');
```

#### File-based Query

You can also run SQL queries stored in `.sql` files:

```typescript
await db.exec('queries/init.sql');
```

### Get Output from the Query

If you want the result of the query, set the `value` option to `true`.

```typescript
const result = await db.exec('SELECT * FROM users;', { value: true });
console.log(result);
```

## API Reference

### `Qiu`

#### `constructor(type: "pg" | "mysql" | "mariadb", primary: string)`

- **type**: Database type (PostgreSQL, MySQL, or MariaDB).
- **primary**: The connection string or URI of the database.

#### `use(name: string): void`

- **name**: The database name to switch to.

#### `exec(query: string, options?: { value?: boolean }): Promise<void | string>`

- **query**: The SQL query string or path to the `.sql` file.
- **options**: (Optional) If `value` is set to `true`, the result of the query will be returned.

### `TaskManager`

Handles the task queue and rate-limited execution of database queries.

#### `exec(cmd: string): Promise<string>`

Executes a database command directly.

#### `enqueue(task: string): void`

Adds a task to the queue for execution.

### `Cache<K, V>`

Implements a simple in-memory caching mechanism.

#### `get(key: K): V | undefined`

Fetches a cached value by key.

#### `set(key: K, value: V): void`

Adds a value to the cache.

#### `has(key: K): boolean`

Checks if the cache contains a specific key.

#### `clear(): void`

Clears all cached values.

### `RateLimit`

Controls the rate at which tasks are executed to prevent flooding the database.

#### `isAllowed(): boolean`

Checks if the current task is allowed based on the rate limit.

#### `waitForAvailability(): Promise<void>`

Waits until the rate limit becomes available.

## Example

```typescript
import { Qiu } from '@medishn/gland-qiu';

const db = new Qiu('pg', 'postgresql://username:password@localhost:5432/mydb');

db.use('testdb');

await db.exec('queries/init.sql');
const result = await db.exec('SELECT * FROM users;', { value: true });
console.log(result);
```

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## Changelog

Details about the latest changes are documented in [CHANGELOG.md](CHANGELOG.md).

## Security

If you find any security-related issues, please report them to [bitsgenix@gmail.com](mailto:bitsgenix@gmail.com).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.