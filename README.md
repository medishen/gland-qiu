# @medishn/gland-qiu

[![NPM Version](https://img.shields.io/npm/v/@medishn/gland-qiu.svg)](https://www.npmjs.com/package/@medishn/gland-qiu)
[![License](https://img.shields.io/npm/l/@medishn/gland-qiu.svg)](LICENSE)

`@medishn/gland-qiu` is a flexible and efficient database management tool that handles multiple SQL databases with powerful caching, rate-limiting, and task management functionalities for database operations.

## Features

- **Multi-database Support**: Supports various SQL databases through a flexible configuration.
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
import { Qiu } from "@medishn/gland-qiu";

const db = new Qiu({
  type: "postgresql",
  connect: "psql -U postgres -d postgres -h localhost -p 5432",
});
```

You can also specify MySQL or MariaDB:

```typescript
const db = new Qiu({
  type: "mysql",
  connect: "mysql://username:password@localhost:3306/mydatabase",
});
```

### Execute a Query

#### Simple Query

To execute a simple SQL query, use the `exec` method.

```typescript
await db.exec("SELECT * FROM users;");
```

#### File-based Query

You can also run SQL queries stored in `.sql` files:

```typescript
await db.exec("queries/init.sql", { isFile: true });
```

### Get Output from the Query

If you want the result of the query, set the `value` option to `true`.

```typescript
const result = await db.exec("SELECT * FROM users;", { value: true });
console.log(result);
```

## API Reference

### `Qiu`

#### `constructor(config: { connect: string, type: DatabaseSqlType })`

- **config**: An object containing:
  - **connect**: The connection string or URI of the database.
  - **type**: The type of database.

#### `exec(query: string, options?: { value?: boolean, isFile?: boolean }): Promise<void | string>`

- **query**: The SQL query string or path to the `.sql` file.
- **options**: (Optional) If `value` is set to `true`, the result of the query will be returned. If `isFile` is set to `true`, the query will be treated as a file path.

## Example

```typescript
import { Qiu } from "@medishn/gland-qiu";

const db = new Qiu({
  type: "postgresql",
  connect: "psql -U postgres -d test_qiu -h localhost -p 5432",
});

await db.exec("init.sql", { isFile: true });
const result = await db.exec("SELECT * FROM users;", { value: true });
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

```

This updated README includes new features, modified examples, and improved descriptions based on the recent changes in the `CHANGELOG.md`. Make sure to review the README to ensure it aligns perfectly with your package’s current functionality.
```
