import { expect } from "chai";
import { describe, it } from "mocha";
import { Sanitizer } from "../../lib/sanitize";

describe("Sanitizer", () => {
    describe("input", () => {
      it("should escape backslashes and single quotes", () => {
        const input = "O'Reilly\\";
        const sanitized = Sanitizer.input(input);
        expect(sanitized).to.equal("O\\\\'Reilly\\\\");
      });

      it("should handle empty input", () => {
        const input = "";
        const sanitized = Sanitizer.input(input);
        expect(sanitized).to.equal("");
      });

      it("should not modify safe input", () => {
        const input = "safe input";
        const sanitized = Sanitizer.input(input);
        expect(sanitized).to.equal("safe input");
      });

      it("should handle input with multiple special characters", () => {
        const input = "input'\\with\\special\\chars'";
        const sanitized = Sanitizer.input(input);
        expect(sanitized).to.equal(
          "input\\\\'\\\\with\\\\special\\\\chars\\\\'"
        );
      });
    });

    describe("validateIdentifier", () => {
      it("should validate a correct identifier", () => {
        const identifier = "valid_identifier1";
        expect(Sanitizer.validateIdentifier(identifier)).to.be.true;
      });

      it("should throw an error for an invalid identifier", () => {
        const identifier = "invalid identifier!";
        expect(() => Sanitizer.validateIdentifier(identifier)).to.throw(
          "Invalid SQL identifier: invalid identifier!"
        );
      });

      it("should throw an error for an identifier starting with a number", () => {
        const identifier = "1_invalidIdentifier";
        expect(() => Sanitizer.validateIdentifier(identifier)).to.throw(
          "Invalid SQL identifier: 1_invalidIdentifier"
        );
      });

      it("should throw an error for an identifier with special characters", () => {
        const identifier = "invalid#identifier";
        expect(() => Sanitizer.validateIdentifier(identifier)).to.throw(
          "Invalid SQL identifier: invalid#identifier"
        );
      });
    });

  describe("SQL Injection Tests", () => {
    it("should escape SQL injection attempts in input", () => {
      const sqlInjection = "1'; DROP TABLE users;--";
      const sanitized = Sanitizer.input(sqlInjection);
      expect(sanitized).to.equal("1\\\\'; DROP TABLE users;--");
    });

    it("should handle multiple SQL injection attempts in input", () => {
      const sqlInjection = "1';-- OR 1=1; DROP TABLE users;";
      const sanitized = Sanitizer.input(sqlInjection);
      expect(sanitized).to.equal("1\\\\';-- OR 1=1; DROP TABLE users;");
    });
  });
});
