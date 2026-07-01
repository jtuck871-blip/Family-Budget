import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function SpendingSplitCard({ needsPct, wantsPct, savingsPct, needsTarget, wantsTarget, savingsTarget }) {
  const data = [
    { name: "Needs", value: needsPct || 1, color: "#3b82f6" },
    { name: "Wants", value: wantsPct || 1, color: "#f59e0b" },
    { name: "Savings", value: savingsPct || 1, color: "#10b981" },
  ];

  const getDiff = (actual, target) => {
    const diff = actual - target;
    if (diff > 0) return `+${diff}%`;
    if (diff < 0) return `${diff}%`;
    return "0%";
  };

  const getDiffColor = (actual, target, type) => {
    const diff = actual - target;
    if (type === "savings") return diff >= 0 ? "text-emerald-600" : "text-red-500";
    return diff <= 0 ? "text-emerald-600" : "text-red-500";
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Spending Split</p>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={22} outerRadius={35} dataKey="value" stroke="none" paddingAngle={2}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-1 mb-2">
            <span className="text-[10px] font-semibold text-muted-foreground"></span>
            <span className="text-[10px] font-semibold text-muted-foreground text-right">PLAN</span>
            <span className="text-[10px] font-semibold text-muted-foreground text-right">ACTUAL</span>
          </div>
          {[
            { label: "Needs", actual: needsPct, target: needsTarget, color: "#3b82f6", type: "needs" },
            { label: "Wants", actual: wantsPct, target: wantsTarget, color: "#f59e0b", type: "wants" },
            { label: "Savings", actual: savingsPct, target: savingsTarget, color: "#10b981", type: "savings" },
          ].map((item) => (
            <div key={item.label} className="grid grid-cols-3 gap-1 py-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium">{item.label}</span>
                <span className={`text-[10px] font-medium ${getDiffColor(item.actual, item.target, item.type)}`}>
                  {getDiff(item.actual, item.target)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground text-right">{item.target}%</span>
              <span className="text-xs font-semibold text-right">{item.actual}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}