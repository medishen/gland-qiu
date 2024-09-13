import { expect } from "chai";
import { describe, beforeEach, it } from "mocha";
import { Qiu } from "../../lib/Qiu";
import path from "path";
describe("CLI namespace", () => {
  let qiu: Qiu;
  beforeEach(async () => {
    qiu = new Qiu(
      "mariadb",
      `-u ${process.env.DB_USERNAME} -p${process.env.DB_PASSWORD}`
    );
    await qiu.exec("CREATE DATABASE IF NOT EXISTS test_qiu");
    qiu.use("test_qiu");
  });
  it("return error for invalid Sql", () => {
    qiu.exec("SHOW DATABASE;").catch((err: any) => {
      expect(err.message).to.include("You have an error in your SQL syntax");
    });
  });
  it("load Sql Query With Files", async () => {
    const createTableQuery = path.join(__dirname, "sql", "user_table.sql");
    const tableName = "user";
    await qiu.exec(createTableQuery);

    const checkTableQuery = `SHOW TABLES;`;
    const result = await qiu.exec(checkTableQuery, { value: true });
    expect(result).to.include(tableName);
  });
});
