import { sanitizeSQL } from "../sanitizer";

describe("SQL Sanitizer", () => {
  it("should allow safe SELECT queries", () => {
    const query = "SELECT id, username, email FROM users WHERE last_login > NOW() - INTERVAL '30 days';";
    const result = sanitizeSQL(query);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should block query with forbidden keyword (DROP)", () => {
    const query = "SELECT id FROM users; DROP TABLE users;";
    const result = sanitizeSQL(query);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("Forbidden keyword or action detected: 'DROP'");
  });

  it("should block query with forbidden keyword (ALTER)", () => {
    const query = "ALTER TABLE users ADD COLUMN role VARCHAR(50);";
    const result = sanitizeSQL(query);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("Forbidden keyword or action detected: 'ALTER'");
  });

  it("should block multi-statement queries", () => {
    const query = "SELECT id FROM users; SELECT email FROM profiles;";
    const result = sanitizeSQL(query);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("Multiple statements are not allowed");
  });

  it("should allow semicolon at the very end of query", () => {
    const query = "SELECT id FROM users;";
    const result = sanitizeSQL(query);
    expect(result.isValid).toBe(true);
  });
});
