const FORBIDDEN_KEYWORDS = [
  "ALTER",
  "DROP",
  "RENAME",
  "TRUNCATE",
  "GRANT",
  "REVOKE",
  "CREATE USER",
  "VACUUM",
  "ANALYZE",
  "COPY",
  "LOAD",
  "PG_SLEEP",
  "PG_READ_FILE",
  "PG_WRITE_FILE",
  "PG_EXECUTE",
];

/**
 * Checks if a query is safe from forbidden admin commands and multi-statements.
 */
export function sanitizeSQL(query: string): { isValid: boolean; error: string | null } {
  if (!query || query.trim() === "") {
    return { isValid: false, error: "The query field cannot be empty." };
  }

  // 1. Check for forbidden keywords (ignoring comments/strings simplified)
  const normalizedQuery = query.toUpperCase();
  for (const keyword of FORBIDDEN_KEYWORDS) {
    // Check keyword with word boundaries to avoid matching things like "dropping" or "alteration"
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(normalizedQuery)) {
      return {
        isValid: false,
        error: `Security violation: Forbidden keyword or action detected: '${keyword}'.`,
      };
    }
  }

  // 2. Check for multi-statements (unquoted semicolons followed by commands)
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inCommentLine = false;
  let inCommentBlock = false;
  let foundSemicolon = false;
  let trailingQuery = "";

  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    const nextChar = query[i + 1] || "";

    // Handle single line comments --
    if (inCommentLine) {
      if (char === "\n") {
        inCommentLine = false;
      }
      continue;
    }

    // Handle block comments /* ... */
    if (inCommentBlock) {
      if (char === "*" && nextChar === "/") {
        inCommentBlock = false;
        i++; // skip /
      }
      continue;
    }

    // Detect comments starting
    if (char === "-" && nextChar === "-") {
      inCommentLine = true;
      i++;
      continue;
    }
    if (char === "/" && nextChar === "*") {
      inCommentBlock = true;
      i++;
      continue;
    }

    // Toggle quote state
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    // If outside quotes/comments, look for semicolon
    if (!inSingleQuote && !inDoubleQuote) {
      if (char === ";") {
        foundSemicolon = true;
        continue;
      }
      if (foundSemicolon) {
        trailingQuery += char;
      }
    }
  }

  // If there's non-whitespace content after the semicolon, reject
  if (foundSemicolon && trailingQuery.trim().length > 0) {
    return {
      isValid: false,
      error: "Security violation: Multiple statements are not allowed.",
    };
  }

  return { isValid: true, error: null };
}
