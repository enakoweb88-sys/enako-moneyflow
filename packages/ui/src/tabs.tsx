import * as React from "react";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={`border-b border-slate-200 flex space-x-6 overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`pb-3 text-sm font-medium transition-all duration-150 border-b-2 whitespace-nowrap cursor-pointer ${
              isActive
                ? "border-emerald-600 text-emerald-800 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-2 text-xs font-semibold ${isActive ? "text-emerald-800" : "text-slate-400"}`}
              >
                ({tab.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
