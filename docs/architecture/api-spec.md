# API Specification

This document defines the API endpoints, contracts, and interaction models for the DailySQL application.

---

## 1. Design Principles

- **JSON Payloads**: All requests and responses must use standard JSON formats with `Content-Type: application/json`.
- **Stateless Verification**: The validation of queries is done per request. The server executes, validates, and rolls back the database state in a single request transaction.
- **Security by Obfuscation & Isolation**: The solution query (`solution_sql`) and database connection strings of the main database must **never** be exposed to the client. Only sanitized comparison outcomes and query outputs are returned.
- **Standard HTTP Status Codes**: Use descriptive HTTP status codes:
  - `200 OK`: Successful retrieval or validation completion (even if the query fails validation, the request itself succeeded).
  - `400 Bad Request`: Invalid input shape, missing fields.
  - `404 Not Found`: Daily challenge not found.
  - `429 Too Many Requests`: Rate limit exceeded.
  - `500 Internal Server Error`: Internal system or execution engine error.

---

## 2. API Endpoints

### 2.1. Get Daily Challenge
Retrieve metadata for the current day's active challenge.

- **Endpoint**: `/api/challenges/daily`
- **Method**: `GET`
- **Authentication**: Optional (Anonymous users can retrieve challenges; authenticated users receive personalized history if logged in).

#### Response Payload (`200 OK`)
```json
{
  "id": 42,
  "title": "Filter active user accounts.",
  "description": "Select the id, username, and email of all users who have logged in within the last 30 days.",
  "category": "Filtering",
  "difficulty": "Easy",
  "database": "PostgreSQL",
  "schema": {
    "tableName": "users",
    "columns": [
      { "name": "id", "type": "integer" },
      { "name": "username", "type": "varchar(100)" },
      { "name": "email", "type": "varchar(255)" },
      { "name": "last_login", "type": "timestamp" }
    ]
  },
  "initialData": [
    {
      "id": 1,
      "username": "alice_jones",
      "email": "alice@example.com",
      "last_login": "2026-05-20T10:23:00.000Z"
    },
    {
      "id": 2,
      "username": "bob_smith",
      "email": "bob@example.com",
      "last_login": "2025-11-01T14:45:00.000Z"
    }
  ]
}
```
> [!IMPORTANT]
> The `solution_sql` and `expected_data` (the correct answers) must **never** be included in this response to prevent users from inspecting the network tab to cheat.

---

### 2.2. Submit Challenge Attempt
Submit a user's SQL query for execution and validation.

- **Endpoint**: `/api/challenges/attempt`
- **Method**: `POST`
- **Payload Shape**:
```json
{
  "challengeId": 42,
  "query": "SELECT id, username, email FROM users WHERE last_login > NOW() - INTERVAL '30 days';"
}
```

#### Response Payload - Success (`200 OK`)
Returned when the query compiles, runs successfully, and matches the correct output.
```json
{
  "success": true,
  "error": null,
  "executionTimeMs": 24,
  "results": [
    {
      "id": 1,
      "username": "alice_jones",
      "email": "alice@example.com"
    }
  ],
  "expectedResults": [
    {
      "id": 1,
      "username": "alice_jones",
      "email": "alice@example.com"
    }
  ]
}
```

#### Response Payload - Verification Failure (`200 OK`)
Returned when the query executes successfully but does not produce the expected results.
```json
{
  "success": false,
  "error": null,
  "executionTimeMs": 18,
  "results": [
    {
      "id": 1,
      "username": "alice_jones",
      "email": "alice@example.com"
    },
    {
      "id": 2,
      "username": "bob_smith",
      "email": "bob@example.com"
    }
  ],
  "expectedResults": [
    {
      "id": 1,
      "username": "alice_jones",
      "email": "alice@example.com"
    }
  ]
}
```

#### Response Payload - Execution/SQL Error (`200 OK` or `400 Bad Request`)
Returned when the database throws a syntax error or runtime exception.
```json
{
  "success": false,
  "error": "syntax error at or near \"WHERR\"",
  "executionTimeMs": 0,
  "results": null,
  "expectedResults": null
}
```

---

## 3. Error Codes & Handling

When returning an error wrapper from the API (for client validation, server-side exceptions, etc.), follow this structure:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "The query field cannot be empty.",
    "details": []
  }
}
```

### Common Error Codes
- `SQL_SYNTAX_ERROR`: The SQL runner caught a PG syntax error.
- `TIMEOUT_EXCEEDED`: User query took longer than the allocated statement timeout (1000ms).
- `CHALLENGE_NOT_FOUND`: The requested `challengeId` does not exist.
- `RATE_LIMIT_EXCEEDED`: The client exceeded the allowed number of executions per minute.
