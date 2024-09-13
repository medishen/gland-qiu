# Software Requirements Specification (SRS) for `@mideshn/gland-qiu`

## Introduction
The `@mideshn/gland-qiu` package is a lightweight Node.js ORM tool designed for interacting with SQL databases like PostgreSQL, MySQL, and MariaDB. The primary goal is to provide developers with an efficient way to run SQL queries, manage database tasks, and handle rate-limited operations.

## Purpose
The purpose of this SRS is to outline the requirements, functionalities, and architecture of the `@mideshn/gland-qiu` package.

## Scope
- Execute SQL queries against PostgreSQL, MySQL, and MariaDB databases.
- Manage task execution using a rate-limited queue system.
- Enable execution of SQL commands or files.
- Support caching for optimized database connections.
- Handle SQL error reporting and logging.
- Monitor performance using Node.js performance hooks.

## Functional Requirements
1. **Database Connection**: Establish connections using system commands for PostgreSQL, MySQL, and MariaDB.
2. **Execute Queries**: Run raw SQL queries or execute commands from `.sql` files.
3. **Rate Limiting**: Implement rate-limiting mechanisms to prevent overwhelming the database with requests.
4. **Task Management**: Queue SQL queries and execute them in FIFO order.
5. **Caching**: Reuse cached database connection commands for optimized performance.
6. **Error Handling**: Properly handle and log SQL syntax errors and failed executions.
7. **Performance Monitoring**: Track and report memory usage and execution times.

## Non-Functional Requirements
1. **Performance**: The package must execute tasks with minimal overhead and log performance data.
2. **Reliability**: Ensure accurate SQL execution with clear error reporting for debugging.
3. **Scalability**: The system must be capable of handling high volumes of SQL queries in a rate-limited manner.
4. **Security**: Ensure that any database credentials or sensitive information are managed securely.

## External Interface Requirements
- **Command-Line Interface (CLI)**: The package interacts with the database through command-line system commands (`psql`, `mysql`, `mariadb`).
- **File System**: Supports executing `.sql` files stored in the file system.
- **Logging**: Logs errors, performance metrics, and other execution details to the console.

## Architecture
- **Task Manager**: Handles the queue and execution of SQL commands.
- **Rate Limiter**: Controls the rate of SQL query execution based on predefined limits.
- **Cache**: Stores reusable database connection strings to optimize performance.
- **Error Handling**: Detects SQL syntax errors and logs them with appropriate context.
