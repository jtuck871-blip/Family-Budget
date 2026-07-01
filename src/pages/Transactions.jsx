import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Plus, Trash2, ArrowLeft, ArrowRight, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TransactionCard from "@/components/budget/TransactionCard";
import AddTransactionDialog from "@/components/budget/AddTransactionDialog";

const TYPE_FILTERS = ["all", "needs", "wants", "savings", "income"];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const loadTransactions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .limit(200);

    setTransactions(data || []);
    setLoading(false);
  };

  useEffect(() => { loadTransactions(); }, []);

  const filtered = transactions.filter((t) => {
    const matchesSearch = !search || 
      (t.merchant || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.category_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const categorizeTransaction = async (id, newType) => {
    await supabase
      .from("transactions")
      .update({ type: newType })
      .eq("id", id);
    
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, type: newType } : t
    ));
  };

  const handleDelete = async (id) => {
    await supabase.from("transactions").delete().eq("id", id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAdd = async (data) => {
    await supabase.from("transactions").insert([data]);
    loadTransactions();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">Transactions</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all ${
              typeFilter === f
                ? "bg-primary text-primary-foreground"
                : "bg-white text-muted-foreground border border-border hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transactions List with Swipe Buttons */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-border/50 p-4">
              <TransactionCard transaction={t} />

              {/* Swipe / Quick Categorize Buttons */}
              <div className="flex gap-2 mt-3 pt-3 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => categorizeTransaction(t.id, "needs")}
                >
                  <ArrowRight className="w-4 h-4 mr-1" /> Needs
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => categorizeTransaction(t.id, "wants")}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Wants
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => categorizeTransaction(t.id, "savings")}
                >
                  <ArrowDown className="w-4 h-4 mr-1" /> Savings
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(t.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm text-muted-foreground">No transactions found</p>
        </div>
      )}

      <AddTransactionDialog open={showAdd} onOpenChange={setShowAdd} onSave={handleAdd} />
    </div>
  );
}