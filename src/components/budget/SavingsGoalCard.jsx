import React from "react";

export default function SavingsGoalCard({ goal }) {
  const pct = goal.target_amount > 0 ? Math.min((goal.current_amount / goal.target_amount) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 bg-emerald-50">
        {goal.icon || "🎯"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-foreground">{goal.name}</span>
          <span className="text-sm text-muted-foreground">
            ${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: goal.color || "#10b981",
            }}
          />
        </div>
      </div>
    </div>
  );
}