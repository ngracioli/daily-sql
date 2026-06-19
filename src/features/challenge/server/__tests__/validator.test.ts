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
    expect(result.message).toContain("Column mismatch");
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
