# Frequently Asked Questions (FAQ) for `@medishn/gland-qiu`

## General Questions

### 1. What is `@medishn/gland-qiu`?
`@medishn/gland-qiu` is a lightweight Node.js ORM tool designed for seamless interaction with SQL databases, including PostgreSQL, MySQL, and MariaDB. It simplifies the execution of SQL queries and manages database tasks efficiently, with a focus on performance and reliability.

### 2. What are the main features of `@medishn/gland-qiu`?
- Execute raw SQL queries and commands from `.sql` files.
- Manage task execution with a rate-limited queue system.
- Implement caching for optimized database connections.

## Installation

### 3. How do I install `@medishn/gland-qiu`?
You can install `@medishn/gland-qiu` using npm. Run the following command in your project directory:

```bash
npm install @medishn/gland-qiu
```

### 4. Are there any dependencies required?
`@medishn/gland-qiu` primarily relies on Node.js. Ensure you have Node.js (version 12 or higher) installed on your machine.

## Usage

### 5. How do I connect to a database using `@medishn/gland-qiu`?
You can create a new instance of the `Qiu` class with the appropriate database connection details. Here’s an example for connecting to a PostgreSQL database:

```typescript
import { Qiu } from '@medishn/gland-qiu';

const db = new Qiu({
  type: 'postgresql',
  connect: 'psql -U username -d database_name -h localhost -p 5432',
});
```

### 6. Can I execute SQL files with `@medishn/gland-qiu`?
Yes! You can execute SQL commands stored in `.sql` files. Use the `exec` method, specifying the file path:

```typescript
await db.exec('file.sql',{isFile:true});
```

### 7. What is the rate-limiting feature?
The rate-limiting feature controls the rate at which SQL queries are executed to prevent overwhelming the database with requests. You can configure the limits when initializing the `Qiu` class.

## Error Handling

### 8. How does `@medishn/gland-qiu` handle errors?
The package includes error handling mechanisms that log SQL syntax errors and failed executions with detailed context, making it easier to debug issues.

### 9. What types of errors can I expect?
Common errors include SQL syntax errors, connection errors, and execution failures. All errors are logged to the console for your review.

## Performance

### 10. How does the caching feature work?
The caching feature reuses database connection commands to optimize performance. This reduces the overhead associated with establishing new connections for every request.