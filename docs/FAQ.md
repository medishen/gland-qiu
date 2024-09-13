# Frequently Asked Questions

## What databases does `@mideshn/gland-qiu` support?
The current version supports PostgreSQL, MySQL, and MariaDB databases.

## How do I change the database I’m working on?
You can switch the active database using the `use` method. For example, `qiu.use('my_database');`.

## Does this package support SQL file execution?
Yes. The package can execute `.sql` files directly. Just pass the file path as the query in the `exec` method.

## Is rate limiting customizable?
Yes, you can adjust the rate limiting parameters by configuring the `RateLimit` class. You can specify the maximum requests and the time window.

## How can I monitor performance?
The package includes a performance monitoring system using Node.js's built-in `perf_hooks`. Memory usage and execution times are logged before and after each operation.

## How do I handle SQL syntax errors?
If there's a syntax error in your SQL queries, the package will throw a `SQL Syntax Error`. Ensure your queries are correctly formatted and tested.

## Where can I report issues or request features?
You can report issues or request features by opening a ticket on the GitHub repository [here](https://github.com/medishen/gland-qiu/issues).
