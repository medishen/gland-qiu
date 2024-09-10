import { expect } from "chai";
import { describe, beforeEach, it } from "mocha";
import { CLI } from "../../lib/cli";
import path from "path";
describe("CLI namespace", () => {
  beforeEach(async () => {
    CLI.CONFIG.configure(
      "mariadb",
      `-u ${process.env.DB_USERNAME} -p${process.env.DB_PASSWORD}`,
      'test_qiu'
    );
  });
  it("return error for invalid Sql", () => {
    CLI.CONFIG.run("SHOW DATABASE;").catch((err: any) => {
      expect(err.message).to.include("You have an error in your SQL syntax");
    });
  });
  it("load Sql Query With Files", async () => {
    const createTableQuery = path.join(__dirname, "sql", "user_table.sql");
    const tableName = "user";
    await CLI.CONFIG.run(createTableQuery);

    const checkTableQuery = `SHOW TABLES;`;
    const result = await CLI.CONFIG.run(checkTableQuery);
    expect(result).to.include(tableName);
  });
});
