import React from "react";
import { format } from "date-fns";

export default function TransactionCard({ transaction, compact }) {
  const amount = transaction?.amount ?? 0;
  const isIncome = transaction?.type === "income";
  const metadata = transaction?.merchant || transaction?.description || transaction?.category_name || transaction?.type;
  const dateLabel = transaction?.date ? format(new Date(transaction.date), "MMM d") : null;

  return (
    <div className={`w-full rounded-2xl p-4 shadow-sm border border-border/50 bg-white ${compact ? "min-w-[18rem]" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{metadata}</p>
          <p className="text-xs text-muted-foreground truncate">
            {transaction?.category_name || transaction?.type || "Transaction"}
          </p>
          {dateLabel ? <p className="text-[11px] text-muted-foreground mt-1">{dateLabel}</p> : null}
        </div>
        <div className={`text-right text-sm font-semibold ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
          {isIncome ? "+" : "-"}${Math.abs(amount).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
