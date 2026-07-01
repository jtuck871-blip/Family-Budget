import React from "react";

export default function CategoryRow({ name, spent, budget, color, icon }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOver = spent > budget;

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
        style={{ backgroundColor: color + "20", color: color }}
      >
        {icon || "•"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-foreground truncate">{name}</span>
          <div className="flex items-center gap-2 text-sm">
            <span className={isOver ? "text-red-500 font-semibold" : "text-foreground font-medium"}>
              ${spent.toLocaleString()}
            </span>
            <span className="text-muted-foreground">/ ${budget.toLocaleString()}</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: isOver ? "#ef4444" : color,
            }}
          />
        </div>
      </div>
    </div>
  );
}