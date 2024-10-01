import { expect } from "chai";
import { describe, beforeEach, it } from "mocha";
import { Qiu } from "../../../lib/Qiu";
describe("Redis", () => {
  let qiu: Qiu;
  beforeEach(async function () {
    qiu = new Qiu({
      type: "redis",
      connect: "localhost:6379",
    });
    const pingResponse = await qiu.exec("ping", { value: true });
    if (pingResponse) {
      expect(pingResponse.trim()).to.equal("PONG");
    }
  });

  it("should return keys matching pattern '*'", async function () {
    const keys = await qiu.exec("keys '*'", { value: true });
    if (keys) {
      expect(keys.trim().split("\n")).to.be.an("array").that.is.not.empty;
      keys
        .trim()
        .split("\n")
        .forEach((key: string) => {
          expect(key).to.be.a("string").that.is.not.empty;
        });
    }
  });

  it("should return an empty list if no keys match", async function () {
    const result = await qiu.exec("keys 'nonexistent*'", { value: true });
    expect(result!.trim().split("\n")).to.be.an("array").include("");
  });
});
