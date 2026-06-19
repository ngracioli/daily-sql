"use client";

import { useState } from "react";
import { TopNavBar } from "@/widgets/TopNavBar";
import { ProblemPanel } from "@/widgets/ProblemPanel";
import { EditorPanel } from "@/widgets/EditorPanel";

// Mock data matching the original HTML
const MOCK_CHALLENGE = {
  title: "Filter active user accounts.",
  database: "PostgreSQL",
  description: "Select all users who have logged in within the last 30 days.",
};

const MOCK_SCHEMA = {
  tableName: "users",
  columns: [
    { name: "id", type: "int" },
    { name: "username", type: "string" },
    { name: "email", type: "string" },
    { name: "last_login", type: "timestamp" },
  ],
};

const MOCK_COLUMNS = [
  { key: "id", header: "id" },
  { key: "username", header: "username" },
  { key: "email", header: "email" },
  { key: "last_login", header: "last_login" },
];

const MOCK_INITIAL_DATA = [
  {
    id: 1,
    username: "alice_jones",
    email: "alice@example.com",
    last_login: "2024-03-15 10:23:00",
  },
  {
    id: 2,
    username: "bob_smith",
    email: "bob@example.com",
    last_login: "2023-11-01 14:45:00",
  },
  {
    id: 3,
    username: "charlie_brown",
    email: "charlie@example.com",
    last_login: "2024-04-02 09:12:00",
  },
];

const MOCK_EXPECTED_DATA = [
  {
    id: 1,
    username: "alice_jones",
    email: "alice@example.com",
    last_login: "2024-03-15 10:23:00",
  },
  {
    id: 3,
    username: "charlie_brown",
    email: "charlie@example.com",
    last_login: "2024-04-02 09:12:00",
  },
];

const DEFAULT_SQL = `SELECT * FROM users
WHERE last_login > NOW() - INTERVAL '30 days';`;

export default function ChallengePage() {
  const [sql, setSql] = useState<string | undefined>(DEFAULT_SQL);
  const [output, setOutput] = useState<string | undefined>();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    // Simulate execution delay
    setTimeout(() => {
      setOutput("Success: Query executed correctly.\nResult matches expected output.");
      setIsExecuting(false);
    }, 1000);
  };

  return (
    <>
      <TopNavBar />
      <main className="flex-grow flex flex-col lg:flex-row w-full overflow-hidden">
        <ProblemPanel
          challenge={MOCK_CHALLENGE}
          schema={MOCK_SCHEMA}
          dataViewer={{
            columns: MOCK_COLUMNS,
            initialData: MOCK_INITIAL_DATA,
            expectedData: MOCK_EXPECTED_DATA,
          }}
        />
        <EditorPanel
          sqlValue={sql || ""}
          onSqlChange={setSql}
          onExecute={handleExecute}
          consoleOutput={output}
          isExecuting={isExecuting}
        />
      </main>
    </>
  );
}

