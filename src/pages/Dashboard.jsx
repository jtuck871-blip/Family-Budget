import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";

import SpendingDonut from "@/components/budget/SpendingDonut";
import CategoryRow from "@/components/budget/CategoryRow";
import CashFlowCard from "@/components/budget/CashFlowCard";
import SpendingSplitCard from "@/components/budget/SpendingSplitCard";
import TransactionCard from "@/components/budget/TransactionCard";
import AddTransactionDialog from "@/components/budget/AddTransactionDialog";
import { Button } from "@/components/ui/button";

const CATEGORY_META = {
  "Groceries": { color: "#10b981", icon: "🛒" },
  "Fuel": { color: "#f59e0b", icon: "⛽" },
  "Bills": { color: "#06b6d4", icon: "📄" },
  "Health": { color: "#ef4444", icon: "💊" },
  "Kids": { color: "#8b5cf6", icon: "🧸" },
  "Netball": { color: "#f97316", icon: "🏀" },
  "Savings": { color: "#10b981", icon: "💰" },
  "Bali Trip": { color: "#3b82f6", icon: "🏝️" },
  "Eating Out": { color: "#ec4899", icon: "🍽️" },
  "Transport": { color: "#6366f1", icon: "🚆" },
  "Other": { color: "#94a3b8", icon: "📦" },
};

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const monthKey = format(currentMonth, "yyyy-MM");
  const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
  const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");

  const loadData = async () => {
    setLoading(true);

    const { data: txns } = await supabase
      .from("transactions")
      .select("*")
      .gte("date", start)
      .lte("date", end)
      .order("date", { ascending: false });

    const { data: budgetData } = await supabase
      .from("monthly_budgets")
      .select("*")
      .eq("month", monthKey)
      .limit(1);

    setTransactions(txns || []);
    setBudget(budgetData?.[0] || null);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [monthKey]);

  const stats = useMemo(() => {
    const spending = transactions.filter((t) => t.type === "expense");
    const incomeTxns = transactions.filter((t) => t.type === "income");

    const income = incomeTxns.reduce((s, t) => s + Number(t.amount), 0);
    const totalSpent = spending.reduce((s, t) => s + Number(t.amount), 0);

    const catSpend = {};
    spending.forEach((t) => {
      if (t.category) {
        catSpend[t.category] = (catSpend[t.category] || 0) + Number(t.amount);
      }
    });

    const catData = Object.keys(CATEGORY_META).map((name) => ({
      name,
      spent: catSpend[name] || 0,
      budget: 0,
      color: CATEGORY_META[name].color,
      icon: CATEGORY_META[name].icon,
    }));

    // Actual dollar amounts (fixed)
    const needsSpent = spending
      .filter((t) => ["Groceries", "Bills", "Transport"].includes(t.category))
      .reduce((s, t) => s + Number(t.amount), 0);

    const wantsSpent = spending
      .filter((t) => ["Eating Out", "Entertainment", "Shopping"].includes(t.category))
      .reduce((s, t) => s + Number(t.amount), 0);

    const savingsSpent = spending
      .filter((t) => t.category === "Savings")
      .reduce((s, t) => s + Number(t.amount), 0);

    const totalSpentForPct = totalSpent || 1;
    const needsPct = Math.round((needsSpent / totalSpentForPct) * 100);
    const wantsPct = Math.round((wantsSpent / totalSpentForPct) * 100);
    const savingsPct = 100 - needsPct - wantsPct;

    return {
      income,
      totalSpent,
      catData,
      needsSpent,
      wantsSpent,
      savingsSpent,
      needsPct,
      wantsPct,
      savingsPct,
      needsTarget: 50,
      wantsTarget: 30,
      savingsTarget: 20,
    };
  }, [transactions]);

  const recentTxns = transactions.filter((t) => t.type === "expense").slice(0, 6);

  const handleAddTransaction = async (data) => {
    await supabase.from("transactions").insert([data]);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-5">
      {/* Month Selector */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-full hover:bg-muted">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h1>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-full hover:bg-muted">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Budget Empty State or Spending Overview */}
      {!budget ? (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/50 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No budget set for {format(currentMonth, "MMMM")}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[260px] mx-auto">
            Head to Settings to set up your monthly budget and categories.
          </p>
          <Link to="/settings">
            <Button size="lg" className="px-8">
              Set Up Budget
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
          <SpendingDonut
            categories={stats.catData}
            totalBudget={stats.totalSpent}
            totalSpent={stats.totalSpent}
          />
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Spending Categories</p>
            </div>
            <div className="divide-y divide-border/50">
              {stats.catData.map((cat) => (
                <CategoryRow key={cat.name} {...cat} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent Transactions</p>
          <Link to="/transactions" className="text-xs font-medium text-primary">View all</Link>
        </div>
        {recentTxns.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {recentTxns.map((t) => (
              <TransactionCard key={t.id} transaction={t} compact />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 text-center">
            <p className="text-sm text-muted-foreground">No transactions yet this month</p>
          </div>
        )}
      </div>

      {/* Cash Flow + Spending Split */}
      <CashFlowCard
        income={stats.income}
        needsSpent={stats.needsSpent}
        wantsSpent={stats.wantsSpent}
        savingsSpent={stats.savingsSpent}
      />

      {stats.totalSpent > 0 && (
        <SpendingSplitCard
          needsPct={stats.needsPct}
          wantsPct={stats.wantsPct}
          savingsPct={stats.savingsPct}
          needsTarget={stats.needsTarget}
          wantsTarget={stats.wantsTarget}
          savingsTarget={stats.savingsTarget}
        />
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AddTransactionDialog 
        open={showAdd} 
        onOpenChange={setShowAdd} 
        onSave={handleAddTransaction} 
      />
    </div>
  );
}