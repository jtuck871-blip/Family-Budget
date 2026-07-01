import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function CashFlowCard({ income, needsSpent, wantsSpent, savingsSpent }) {
  const totalSpent = needsSpent + wantsSpent + savingsSpent;
  const cashFlow = income - totalSpent;
  const isPositive = cashFlow >= 0;
  const max = income || 1;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Cash flow this month</p>
          <p className={`text-3xl font-bold mt-1 ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
            {isPositive ? "+" : ""}${Math.abs(cashFlow).toLocaleString()}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPositive ? "bg-emerald-50" : "bg-red-50"}`}>
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Income:</span>
          <span className="font-semibold text-foreground">${income.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Needs:</span>
          <span className="font-semibold text-foreground">${needsSpent.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-muted-foreground">Wants:</span>
          <span className="font-semibold text-foreground">${wantsSpent.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-muted-foreground">Savings:</span>
          <span className="font-semibold text-foreground">${savingsSpent.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4 w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
        {needsSpent > 0 && (
          <div className="h-full bg-blue-500 transition-all" style={{ width: `${(needsSpent / max) * 100}%` }} />
        )}
        {wantsSpent > 0 && (
          <div className="h-full bg-amber-400 transition-all" style={{ width: `${(wantsSpent / max) * 100}%` }} />
        )}
        {savingsSpent > 0 && (
          <div className="h-full bg-emerald-400 transition-all" style={{ width: `${(savingsSpent / max) * 100}%` }} />
        )}
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
        <span>$0</span>
        <span>${(max / 3).toFixed(0)}</span>
        <span>${((max * 2) / 3).toFixed(0)}</span>
        <span>${max.toLocaleString()}</span>
      </div>
    </div>
  );
}