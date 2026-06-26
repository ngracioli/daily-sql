export const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
  "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN", "ON",
  "AND", "OR", "NOT", "IN", "LIKE", "BETWEEN", "IS NULL", "IS NOT NULL",
  "INSERT INTO", "UPDATE", "DELETE FROM", "CREATE TABLE", "DROP TABLE",
  "AS", "COUNT", "SUM", "AVG", "MIN", "MAX"
];

let isCompletionProviderRegistered = false;

export interface SchemaContext {
  tables?: Record<string, string[]>;
}

/**
 * Registers a dynamic completion item provider for Monaco editor's SQL language.
 * Uses a mutable SchemaContext reference to support hot swapping of tables/columns
 * without duplicate provider registration.
 */
export function registerSqlAutocompleteProvider(
  monaco: any,
  schemaContext: SchemaContext
) {
  if (isCompletionProviderRegistered) return;

  monaco.languages.registerCompletionItemProvider("sql", {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: any[] = [];

      // 1. Suggest active challenge tables and columns
      if (schemaContext.tables) {
        Object.entries(schemaContext.tables).forEach(([tableName, columns]) => {
          suggestions.push({
            label: tableName,
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: tableName,
            detail: "Table",
            range: range,
          });

          columns.forEach((col) => {
            suggestions.push({
              label: col,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: col,
              detail: `Column (${tableName})`,
              range: range,
            });
          });
        });
      }

      // 3. Suggest standard SQL Keywords
      SQL_KEYWORDS.forEach((keyword) => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: "SQL Keyword",
          range: range,
        });
      });

      return { suggestions };
    },
  });

  isCompletionProviderRegistered = true;
}
