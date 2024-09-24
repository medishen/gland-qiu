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