import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#2dd4a8", "#f59e0b", "#6366f1", "#ec4899", "#f97316", "#8b5cf6", "#06b6d4"];

export default function SpendingDonut({ categories, totalBudget, totalSpent }) {
  const data = categories.map((c, i) => ({
    name: c.name,
    value: c.spent || 0,
    color: c.color || COLORS[i % COLORS.length],
  }));

  const remaining = Math.max(0, totalBudget - totalSpent);
  if (remaining > 0) {
    data.push({ name: "Remaining", value: remaining, color: "#e5e7eb" });
  }

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground font-medium">Spent</span>
        <span className="text-2xl font-bold text-foreground">
          ${totalSpent.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">
          of ${totalBudget.toLocaleString()} budget
        </span>
      </div>
    </div>
  );
}