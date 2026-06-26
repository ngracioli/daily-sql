"use client";

import { useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Button, Icon } from "@/shared/ui";
import { registerSqlAutocompleteProvider, SchemaContext } from "../model/autocomplete";

export interface SqlEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  fileName?: string;
  tables?: Record<string, string[]>;
}

const schemaContext: SchemaContext = {
  tables: undefined,
};

export function SqlEditor({
  value,
  onChange,
  fileName = "Solution.sql",
  tables,
}: SqlEditorProps) {
  useEffect(() => {
    schemaContext.tables = tables;
  }, [tables]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    registerSqlAutocompleteProvider(monaco, schemaContext);
  };

  return (
    <div className="flex-grow flex flex-col p-lg gap-md border-b border-[#ebebeb]">
      <div className="flex justify-between items-center">
        <span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">
          {fileName}
        </span>
        <Button variant="icon" title="Copy code">
          <Icon name="content_copy" className="text-[18px]" />
        </Button>
      </div>
      <div className="flex-grow bg-[#171717] rounded-lg overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] relative">
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "var(--font-jetbrains-mono)",
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
