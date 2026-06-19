export interface VerificationResult {
  success: boolean;
  message: string | null;
}

/**
 * Normalizes rows by sorting keys to make them comparable.
 */
function normalizeRow(row: any): string {
  if (!row || typeof row !== "object") {
    return String(row);
  }

  // Sort keys alphabetically so column order doesn't affect JSON serialization of values
  const sortedKeys = Object.keys(row).sort();
  const normalizedObj: Record<string, any> = {};
  
  for (const key of sortedKeys) {
    let value = row[key];
    
    // Coerce dates to ISO string
    if (value instanceof Date) {
      value = value.toISOString();
    } else if (typeof value === "string" && !isNaN(Date.parse(value)) && value.includes("-")) {
      // String looks like a timestamp, normalize to ISO/UTC string if it parses
      try {
        value = new Date(value).toISOString();
      } catch (_) {}
    }
    
    // Coerce numeric strings/numbers to floats for comparison stability
    if (typeof value === "number") {
      value = Number(value.toFixed(6)); // Avoid minor floating point issues
    }

    normalizedObj[key] = value;
  }

  return JSON.stringify(normalizedObj);
}

/**
 * Compares two rows for equality after normalization.
 */
function areRowsEqual(rowA: any, rowB: any): boolean {
  return normalizeRow(rowA) === normalizeRow(rowB);
}

/**
 * Verifies that the user's execution output matches the official solution's output.
 */
export function compareResultSets(
  userRows: any[],
  solutionRows: any[],
  userFields: { name: string }[],
  solutionFields: { name: string }[],
  checkOrder: boolean
): VerificationResult {
  // 1. Column count verification
  if (userFields.length !== solutionFields.length) {
    return {
      success: false,
      message: `Schema mismatch: Expected ${solutionFields.length} columns, but query returned ${userFields.length}.`,
    };
  }

  // 2. Column names & order verification
  for (let i = 0; i < solutionFields.length; i++) {
    const expectedName = solutionFields[i].name.toLowerCase();
    const userName = userFields[i].name.toLowerCase();
    if (expectedName !== userName) {
      return {
        success: false,
        message: `Column mismatch: Column index ${i + 1} was expected to be '${expectedName}', but returned '${userName}'.`,
      };
    }
  }

  // 3. Row count verification
  if (userRows.length !== solutionRows.length) {
    return {
      success: false,
      message: `Result mismatch: Expected ${solutionRows.length} rows, but query returned ${userRows.length}.`,
    };
  }

  // 4. Rows data verification
  if (checkOrder) {
    // Scenario A: Ordered comparison (index-to-index matching)
    for (let i = 0; i < solutionRows.length; i++) {
      if (!areRowsEqual(userRows[i], solutionRows[i])) {
        return {
          success: false,
          message: `Result mismatch: Row data at index ${i + 1} does not match the expected solution.`,
        };
      }
    }
  } else {
    // Scenario B: Unordered comparison (multiset frequency check)
    const solutionFrequencies: Record<string, number> = {};
    const userFrequencies: Record<string, number> = {};

    for (const row of solutionRows) {
      const key = normalizeRow(row);
      solutionFrequencies[key] = (solutionFrequencies[key] || 0) + 1;
    }

    for (const row of userRows) {
      const key = normalizeRow(row);
      userFrequencies[key] = (userFrequencies[key] || 0) + 1;
    }

    for (const key of Object.keys(solutionFrequencies)) {
      if (solutionFrequencies[key] !== userFrequencies[key]) {
        return {
          success: false,
          message: "Result mismatch: The returned rows do not match the expected dataset.",
        };
      }
    }
  }

  return { success: true, message: null };
}
