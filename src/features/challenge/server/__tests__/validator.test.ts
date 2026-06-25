import { compareResultSets } from "../validator";

describe("SQL Result Set Validator", () => {
  const userFields = [{ name: "id" }, { name: "username" }];
  const solutionFields = [{ name: "id" }, { name: "username" }];

  it("should match identical result sets", () => {
    const solutionRows = [
      { id: 1, username: "alice" },
      { id: 2, username: "bob" },
    ];
    const userRows = [
      { id: 1, username: "alice" },
      { id: 2, username: "bob" },
    ];

    const result = compareResultSets(userRows, solutionRows, userFields, solutionFields, true);
    expect(result.success).toBe(true);
    expect(result.message).toBeNull();
  });

  it("should fail when column counts mismatch", () => {
    const solutionRows = [{ id: 1, username: "alice" }];
    const userRows = [{ id: 1 }];

    const result = compareResultSets(userRows, solutionRows, [{ name: "id" }], solutionFields, true);
    expect(result.success).toBe(false);
    expect(result.reason).toBe("COLUMN_MISMATCH");
    expect(result.expected?.columns).toEqual(["id", "username"]);
    expect(result.received?.columns).toEqual(["id"]);
    expect(result.message).toContain("Schema mismatch");
  });

  it("should fail when column names mismatch", () => {
    const solutionRows = [{ id: 1, username: "alice" }];
    const userRows = [{ id: 1, name: "alice" }];

    const result = compareResultSets(
      userRows,
      solutionRows,
      [{ name: "id" }, { name: "name" }],
      solutionFields,
      true
    );
    expect(result.success).toBe(false);
    expect(result.reason).toBe("COLUMN_MISMATCH");
    expect(result.expected?.columns).toEqual(["id", "username"]);
    expect(result.received?.columns).toEqual(["id", "name"]);
    expect(result.message).toContain("Column mismatch");
  });

  it("should fail when row counts mismatch", () => {
    const solutionRows = [
      { id: 1, username: "alice" },
      { id: 2, username: "bob" },
    ];
    const userRows = [
      { id: 1, username: "alice" },
    ];

    const result = compareResultSets(userRows, solutionRows, userFields, solutionFields, true);
    expect(result.success).toBe(false);
    expect(result.reason).toBe("ROW_COUNT_MISMATCH");
    expect(result.expected?.rowCount).toBe(2);
    expect(result.received?.rowCount).toBe(1);
    expect(result.message).toContain("Result mismatch: Expected 2 rows");
  });

  it("should compare ordered records strictly", () => {
    const solutionRows = [
      { id: 1, username: "alice" },
      { id: 2, username: "bob" },
    ];
    const userRows = [
      { id: 2, username: "bob" },
      { id: 1, username: "alice" },
    ];

    const result = compareResultSets(userRows, solutionRows, userFields, solutionFields, true);
    expect(result.success).toBe(false);
    expect(result.reason).toBe("ROW_DATA_MISMATCH");
    expect(result.expected?.rows).toEqual(solutionRows);
    expect(result.received?.rows).toEqual(userRows);
    expect(result.message).toContain("Result mismatch: Row data at index 1 does not match");
  });

  it("should compare unordered records successfully", () => {
    const solutionRows = [
      { id: 1, username: "alice" },
      { id: 2, username: "bob" },
    ];
    const userRows = [
      { id: 2, username: "bob" },
      { id: 1, username: "alice" },
    ];

    const result = compareResultSets(userRows, solutionRows, userFields, solutionFields, false);
    expect(result.success).toBe(true);
  });
});
