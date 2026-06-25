"use client";

import { useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultTabId, activeTabId, onTabChange, className = "" }: TabsProps) {
  const [localActiveTab, setLocalActiveTab] = useState(defaultTabId || tabs[0]?.id);
  const activeTab = activeTabId !== undefined ? activeTabId : localActiveTab;

  const handleTabClick = (id: string) => {
    if (onTabChange) {
      onTabChange(id);
    } else {
      setLocalActiveTab(id);
    }
  };

  return (
    <div className={`flex flex-col gap-sm flex-grow ${className}`}>
      <div className="flex items-center gap-md border-b border-[#ebebeb]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`pb-2 border-b-2 text-label-sm font-label-sm transition-colors ${
                isActive
                  ? "border-[#171717] text-[#171717] font-bold"
                  : "border-transparent text-secondary hover:text-[#171717]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="flex-grow">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
