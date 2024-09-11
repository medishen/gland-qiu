import { expect } from "chai";
import { describe, it } from "mocha";
import { Sanitizer } from "../../lib/sanitize";

describe("Sanitizer - SQL Injection Prevention", () => {
  describe("Basic Injection Tests", () => {
    it("should escape simple SQL injection payloads", () => {
      const payload = "1'; DROP TABLE users;--";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal("1\\\\'; DROP TABLE users;--");
    });

    it("should escape single quotes to prevent basic SQL injection", () => {
      const payload = "O'Reilly";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal("O\\\\'Reilly");
    });

    it("should escape semicolons to prevent SQL command injection", () => {
      const payload = "SELECT * FROM users; DELETE FROM users;";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal("SELECT * FROM users; DELETE FROM users;");
    });
  });

  describe("Advanced Injection Techniques", () => {
    it("should handle comment-based SQL injection", () => {
      const payload = "1' --";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal("1\\\\' --");
    });

    it("should handle SQL injection with additional whitespace", () => {
      const payload = "1' OR '1'='1";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal("1\\\\' OR \\\\'1\\\\'=\\\\'1");
    });

    it("should handle SQL injection with encoded characters", () => {
      const payload = "1%27%20OR%20%271%27%3D%271";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal("1%27%20OR%20%271%27%3D%271");
    });
  });

  describe("Union-Based Injection", () => {
    it("should handle SQL injection with UNION statements", () => {
      const payload = "1' UNION SELECT null, username, password FROM users--";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal(
        "1\\\\' UNION SELECT null, username, password FROM users--"
      );
    });
  });

  describe("Blind Injection", () => {
    it("should handle SQL injection that uses conditional logic", () => {
      const payload = "1' AND 1=1--";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal("1\\\\' AND 1=1--");
    });

    it("should handle SQL injection with time-based delay", () => {
      const payload = "1' OR IF(1=1, SLEEP(5), 0)--";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal("1\\\\' OR IF(1=1, SLEEP(5), 0)--");
    });
  });

  describe("Error-Based Injection", () => {
    it("should handle SQL injection designed to generate errors", () => {
      const payload = "1' AND 1=CONVERT(int, (SELECT @@version))--";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal(
        "1\\\\' AND 1=CONVERT(int, (SELECT @@version))--"
      );
    });

    it("should handle SQL injection with invalid syntax causing errors", () => {
      const payload = "1' OR (SELECT 1/0)--";
      const sanitized = Sanitizer.input(payload);
      expect(sanitized).to.equal("1\\\\' OR (SELECT 1/0)--");
    });
  });
});
