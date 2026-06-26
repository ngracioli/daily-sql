"use client";

import { useState } from "react";
import { Tabs, Table, TableColumn } from "@/shared/ui";
import { ColumnDef } from "./SchemaViewer";

export interface DataViewerProps {
  initialData: Record<string, Record<string, any>[]>;
  initialTablesSchema: Record<string, ColumnDef[]>;
  expectedColumns?: TableColumn[];
  expectedData?: Record<string, any>[];
  userColumns?: TableColumn[];
  userData?: Record<string, any>[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
}

export function DataViewer({
  initialData,
  initialTablesSchema,
  expectedColumns,
  expectedData,
  userColumns,
  userData,
  activeTabId,
  onTabChange,
}: DataViewerProps) {
  const tableNames = Object.keys(initialData);
  const [activeTable, setActiveTable] = useState<string | null>(null);

  // Derive the active table selection, falling back to the first available table
  const selectedTable = activeTable && tableNames.includes(activeTable)
    ? activeTable
    : (tableNames[0] || "");

  const tabs = [
    {
      id: "initial",
      label: "Initial Data",
      content: (
        <div className="flex flex-col gap-md">
          {tableNames.length > 1 && (
            <div className="flex gap-xs border-b border-[#ebebeb] pb-2">
              {tableNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setActiveTable(name)}
                  className={`px-3 py-1 rounded-md text-label-sm font-label-sm transition-all cursor-pointer ${
                    selectedTable === name
                      ? "bg-[#171717] text-white shadow-sm font-bold"
                      : "bg-surface-container-lowest text-secondary hover:bg-neutral-100 border border-[#ebebeb]"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
          {selectedTable && initialData[selectedTable] ? (
            <Table
              columns={
                initialTablesSchema[selectedTable]?.map((col) => ({
                  key: col.name,
                  header: col.name,
                })) || []
              }
              data={initialData[selectedTable]}
            />
          ) : (
            <div className="p-4 text-center text-secondary italic text-code-md">
              No table data available.
            </div>
          )}
        </div>
      ),
    },
    {
      id: "expected",
      label: "Expected Result",
      content: expectedColumns && expectedData ? (
        <Table columns={expectedColumns} data={expectedData} />
      ) : (
        <div className="p-8 border border-dashed border-[#ebebeb] rounded-lg bg-[#fafafa] text-center">
          <p className="text-label-sm font-label-sm text-secondary italic">
            Expected results are not loaded yet.
          </p>
        </div>
      ),
    },
    {
      id: "user",
      label: "Your Result",
      content: userColumns && userData ? (
        <Table columns={userColumns} data={userData} />
      ) : (
        <div className="p-8 border border-dashed border-[#ebebeb] rounded-lg bg-[#fafafa] text-center">
          <p className="text-label-sm font-label-sm text-secondary italic">
            No query execution data yet. Execute your query to see results here.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={onTabChange}
    />
  );
}

