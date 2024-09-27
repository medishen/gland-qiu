import { expect } from "chai";
import { describe, beforeEach, it } from "mocha";
import { Qiu } from "../../lib/Qiu";
import path from "path";
describe("Qiu", function () {
  let qiu: Qiu;
  beforeEach(async function () {
    qiu = new Qiu({
      type: "postgresql",
      connect: "psql -U postgres -d postgres -h localhost -p 5432",
    });

    // Drop the database if it exists and create it cleanly
    await qiu.exec("DROP DATABASE IF EXISTS test_qiu", { value: true });
    await qiu.exec("CREATE DATABASE test_qiu", { value: true });

    // Ensure the database is created before reconnecting
    let dbExists = false;
    while (!dbExists) {
      const checkDb = await qiu.exec(
        "SELECT 1 FROM pg_database WHERE datname = 'test_qiu';",
        { value: true }
      );
      dbExists = checkDb!.includes("1");
    }

    // Reconnect to the new test_qiu database
    qiu = new Qiu({
      type: "postgresql",
      connect: "psql -U postgres -d test_qiu -h localhost -p 5432",
    });
  });
  afterEach(async () => {
    qiu.close();
  });
  it("should return List databases", async function () {
    const result = await qiu.exec("\\l", { value: true });
    expect(result).to.be.include("List of databases");
  });

  it("should load SQL Query from Files", async function () {
    const createTableQuery = path.join(__dirname, "sql", "user_table.sql");
    const start = Date.now();
    await qiu.exec(createTableQuery, { isFile: true });
    const checkTableQuery = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'user';
  `;

    // Log result and ensure result is defined
    const result = await qiu.exec(checkTableQuery, { value: true });
    expect(result).to.include("user");
  });
});
