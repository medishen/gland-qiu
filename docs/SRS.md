# Software Requirements Specification (SRS) for `@medishn/gland-qiu`

## Introduction

The `@medishn/gland-qiu` package is a flexible and efficient database management tool for Node.js, designed to interact with SQL databases such as PostgreSQL, MySQL. The primary objective is to provide developers with a powerful yet straightforward way to run SQL queries, manage database tasks, and handle rate-limited operations efficiently.

## Purpose

This SRS outlines the requirements, functionalities, and architecture of the `@medishn/gland-qiu` package, serving as a guide for developers and stakeholders.

## Scope

- Execute SQL queries against PostgreSQL, MySQL databases.
- Manage task execution using a rate-limited queue system.
- Enable execution of SQL commands or files.
- Support in-memory caching for optimized database operations.
- Handle SQL error reporting and logging.
- Monitor performance using Node.js performance hooks.

## Functional Requirements

1. **Database Connection**: Establish connections using command-line system commands for PostgreSQL, MySQL.
2. **Execute Queries**: Run raw SQL queries or execute commands from `.sql` files.
3. **Rate Limiting**: Implement rate-limiting mechanisms to prevent overwhelming the database with requests.
4. **Task Management**: Queue SQL queries and execute them in a FIFO (First In, First Out) order.
5. **Caching**: Reuse cached database connection commands for optimized performance.
6. **Error Handling**: Properly handle and log SQL syntax errors and failed executions with detailed context.
7. **Performance Monitoring**: Track and report memory usage and execution times for queries.

## Non-Functional Requirements

1. **Performance**: The package must execute tasks with minimal overhead and log performance data effectively.
2. **Reliability**: Ensure accurate SQL execution with clear error reporting for debugging.
3. **Scalability**: The system must be capable of handling high volumes of SQL queries in a rate-limited manner.
4. **Security**: Ensure that any database credentials or sensitive information are managed securely and never exposed.

## External Interface Requirements

- **Command-Line Interface (CLI)**: The package interacts with the database through command-line system commands (`psql`, `mysql`).
- **File System**: Supports executing `.sql` files stored in the file system.
- **Logging**: Logs errors, performance metrics, and other execution details to the console.

## Architecture

- **Task Manager**: Handles the queue and execution of SQL commands, ensuring that tasks are executed in a controlled manner.
- **Rate Limiter**: Controls the rate of SQL query execution based on predefined limits to prevent overload.
- **Cache**: Implements a caching mechanism to store reusable database connection strings, optimizing performance.
- **Error Handling**: Detects SQL syntax errors and logs them with context, aiding in debugging and resolution.

## Updated Example Usage

### Using the `Qiu` Class

```typescript
import { Qiu } from "@medishn/gland-qiu";

const db = new Qiu({
  type: "postgresql",
  connect: "psql -U postgres -d test_qiu -h localhost -p 5432",
});

// Execute a query
await db.exec("SELECT * FROM users;", { value: true });
```
