"use client";

import { useEffect, useState } from "react";
import { TopNavBar } from "@/widgets/TopNavBar";
import { ProblemPanel } from "@/widgets/ProblemPanel";
import { EditorPanel } from "@/widgets/EditorPanel";
import { TableColumn } from "@/shared/ui";

export default function ChallengePage() {
  const [challenge, setChallenge] = useState<any>(null);
  const [sql, setSql] = useState<string | undefined>("");
  const [output, setOutput] = useState<string | undefined>();
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // States for query results visualization
  const [activeTab, setActiveTab] = useState<string>("initial");
  const [userColumns, setUserColumns] = useState<TableColumn[] | null>(null);
  const [userData, setUserData] = useState<any[] | null>(null);
  const [expectedColumns, setExpectedColumns] = useState<TableColumn[] | null>(null);
  const [expectedData, setExpectedData] = useState<any[] | null>(null);

  useEffect(() => {
    // Fetch daily challenge on mount
    fetch("/api/challenges/daily")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch challenge");
        return res.json();
      })
      .then((data) => {
        setChallenge(data);
        setSql(`SELECT * FROM ${data.schema.tableName}\nLIMIT 10;`);
      })
      .catch((err) => {
        setOutput(`Error loading daily challenge: ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleExecute = async () => {
    if (!challenge || !sql) return;
    setIsExecuting(true);
    setOutput("Executing query in sandbox...");

    try {
      const response = await fetch("/api/challenges/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.id,
          query: sql,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOutput(`Error: ${data.error?.message || "Something went wrong"}`);
        setUserColumns(null);
        setUserData(null);
        setExpectedColumns(null);
        setExpectedData(null);
        return;
      }

      // Update output columns and rows if available
      if (data.userFields) {
        setUserColumns(data.userFields.map((f: any) => ({ key: f.name, header: f.name })));
      } else {
        setUserColumns(null);
      }
      setUserData(data.results);

      if (data.solutionFields) {
        setExpectedColumns(data.solutionFields.map((f: any) => ({ key: f.name, header: f.name })));
      } else {
        setExpectedColumns(null);
      }
      setExpectedData(data.expectedResults);

      if (data.results) {
        setActiveTab("user");
      }

      if (data.success) {
        setOutput(
          `Success: Query executed correctly.\nResult matches expected output.\nExecution Time: ${data.executionTimeMs}ms`
        );
      } else if (data.error) {
        setOutput(`Failed: ${data.error}\nExecution Time: ${data.executionTimeMs}ms`);
      } else {
        setOutput(`Incorrect: Result rows or columns do not match expected output.\nExecution Time: ${data.executionTimeMs}ms`);
      }
    } catch (err: any) {
      setOutput(`Network/Service Error: ${err.message || "Failed to contact sandboxed execution API."}`);
      setUserColumns(null);
      setUserData(null);
      setExpectedColumns(null);
      setExpectedData(null);
    } finally {
      setIsExecuting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <TopNavBar />
        <main className="flex-grow flex items-center justify-center bg-surface-container-lowest">
          <div className="text-xl font-medium animate-pulse text-neutral-400">Loading daily challenge...</div>
        </main>
      </>
    );
  }

  if (!challenge) {
    return (
      <>
        <TopNavBar />
        <main className="flex-grow flex items-center justify-center bg-surface-container-lowest">
          <div className="text-xl font-medium text-red-500">Failed to load challenge. Please try again.</div>
        </main>
      </>
    );
  }

  // Map backend columns to TableColumn type expected by ProblemPanel
  const dataColumns = challenge.schema.columns.map((col: any) => ({
    key: col.name,
    header: col.name,
  }));

  return (
    <>
      <TopNavBar />
      <main className="flex-grow flex flex-col lg:flex-row w-full overflow-hidden">
        <ProblemPanel
          challenge={{
            title: challenge.title,
            database: challenge.database,
            description: challenge.description,
          }}
          schema={{
            tableName: challenge.schema.tableName,
            columns: challenge.schema.columns,
          }}
          dataViewer={{
            initialColumns: dataColumns,
            initialData: challenge.initialData,
            expectedColumns: expectedColumns || undefined,
            expectedData: expectedData || undefined,
            userColumns: userColumns || undefined,
            userData: userData || undefined,
            activeTabId: activeTab,
            onTabChange: setActiveTab,
          }}
        />
        <EditorPanel
          sqlValue={sql || ""}
          onSqlChange={setSql}
          onExecute={handleExecute}
          consoleOutput={output}
          isExecuting={isExecuting}
          tableName={challenge?.schema?.tableName}
          columns={challenge?.schema?.columns?.map((c: any) => c.name)}
        />
      </main>
    </>
  );
}

