# Changelog

## [1.0.0] - 2024-09-13

### Added

- Initial release of @mideshn/gland-qiu package.
- Added support for PostgreSQL, MySQL, and MariaDB databases.
- Implemented a caching mechanism to reuse database connection details for performance optimization.
- Rate limiter integrated to handle request throttling.
- Task manager system to queue and execute SQL queries sequentially with rate-limiting support.
- Added error handling for SQL syntax errors and file-based queries.
- Introduced memory usage logging and performance measurements.
- Queue system to handle SQL commands execution in a first-in, first-out (FIFO) manner.
- Logging and performance observation using Node.js performance hooks.
- Added database usage switching through the `use` function.

## [1.0.2] - 2024-09-16

### fix

- Execution of postgresql queries and files were fixed.

## [1.0.3] - 2024-09-24

- fix load pgql file

## [2.0.0] - 2024-09-28

### Added

- Added db.json file. This file is for sql databases, in this file it is written how to execute query and file
- A new option was added to the exec method called isFile, which allows the user to choose whether to execute the file or not.
- Added new types for sql.
- The close method was added so that the user can leave the queue by calling this method. And after close, if Qiu is used, it will receive an error.

### fix

- In the previous versions, only the items that did not need a return value were placed in the queue, which caused problems, but in this version, all queries are placed in the queue and are executed in turn, which does not cause problems.
- Uncaused errors in stderror were removed and it only gives errors if the system crashes.

### Changed

- Updated the task manager system to improve efficiency when handling multiple queries.

### Removed

- Now postgresql, mysql, mariadb are no longer supported, but all sql databases (at least most of them are supported) You can take a look at the lib/db.json file to add a new database.

### Known Issues

- There are some performance issues when executing a large number of simultaneous queries. A patch is planned for the next release.

## [2.0.1] - 2024-09-28

### Added

- The documents have been improved and some content has been removed or added

## [2.0.2] - 2024-09-28

### Removed

- Remove extra text

## [2.1.2] - 2024-10-01

### Added

- **Redis Support**: Added functionality to connect and execute queries for Redis as a NoSQL database.
- **Unit Tests**: Implemented unit tests for Redis to ensure proper connection and query execution.
- **Makefile**: Introduced a Makefile for simplified project management and build tasks.
- **Docker Support**: Completed Docker configuration for containerization, including Dockerfiles and `docker-compose.yml`.

### Changed

- **Connection Pooling**: Enhanced the connection pool to support socket management across SQL and NoSQL databases, optimizing active connection limits and task handling.
- **Tests Improvement**: Improved SQL and Redis test cases to verify database interactions and output handling.

### Fixes

- Resolved issues with idle connection removal and socket error handling to enhance stability.

### Miscellaneous

- Added examples for SQL and NoSQL to demonstrate usage and functionality.
- Updated documentation for clarity on new features and usage guidelines.