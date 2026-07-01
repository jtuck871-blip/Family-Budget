import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";

const PRESET_CATEGORIES = [
  { name: "Housing", icon: "🏠", color: "#2dd4a8", type: "needs" },
  { name: "Food & Dining", icon: "🍽️", color: "#f59e0b", type: "needs" },
  { name: "Transportation", icon: "🚗", color: "#6366f1", type: "needs" },
  { name: "Utilities", icon: "💡", color: "#06b6d4", type: "needs" },
  { name: "Health", icon: "🏥", color: "#ef4444", type: "needs" },
  { name: "Shopping", icon: "🛍️", color: "#ec4899", type: "wants" },
  { name: "Entertainment", icon: "🎬", color: "#f97316", type: "wants" },
  { name: "Personal", icon: "👤", color: "#a855f7", type: "wants" },
  { name: "Education", icon: "📚", color: "#8b5cf6", type: "wants" },
  { name: "Savings", icon: "🏦", color: "#10b981", type: "savings" },
];

export default function BudgetSettings() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState("");
  const [needsPct, setNeedsPct] = useState("50");
  const [wantsPct, setWantsPct] = useState("30");
  const [savingsPct, setSavingsPct] = useState("20");
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatBudget, setNewCatBudget] = useState("");
  const [newCatType, setNewCatType] = useState("needs");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();

  const monthKey = format(currentMonth, "yyyy-MM");

  const loadData = async () => {
    setLoading(true);

    const { data: budgets } = await supabase
      .from("monthly_budgets")
      .select("*")
      .eq("month", monthKey)
      .limit(1);

    const { data: cats } = await supabase
      .from("budget_categories")
      .select("*")
      .eq("month", monthKey);

    const b = budgets?.[0] || null;
    setBudget(b);
    setCategories(cats || []);
    setIncome(b?.income?.toString() || "");
    setNeedsPct(b?.needs_target_pct?.toString() || "50");
    setWantsPct(b?.wants_target_pct?.toString() || "30");
    setSavingsPct(b?.savings_target_pct?.toString() || "20");
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [monthKey]);

  const saveBudget = async () => {
    setSaving(true);
    const data = {
      month: monthKey,
      income: parseFloat(income) || 0,
      needs_target_pct: parseInt(needsPct) || 50,
      wants_target_pct: parseInt(wantsPct) || 30,
      savings_target_pct: parseInt(savingsPct) || 20,
    };

    if (budget) {
      await supabase.from("monthly_budgets").update(data).eq("id", budget.id);
    } else {
      await supabase.from("monthly_budgets").insert([data]);
    }

    toast({ title: "Budget saved!" });
    setSaving(false);
    loadData();
  };

  const addCategory = async () => {
    if (!newCatName || !newCatBudget) return;

    const preset = PRESET_CATEGORIES.find((p) => p.name === newCatName);
    setSaving(true);

    await supabase.from("budget_categories").insert([{
      name: newCatName,
      budget_amount: parseFloat(newCatBudget),
      type: preset?.type || newCatType,
      icon: preset?.icon || "•",
      color: preset?.color || "#94a3b8",
      month: monthKey,
    }]);

    setSaving(false);
    setNewCatName(""); setNewCatBudget(""); setNewCatType("needs");
    setShowAddCat(false);
    loadData();
  };

  const updateCategoryBudget = async (cat, newAmount) => {
    await supabase
      .from("budget_categories")
      .update({ budget_amount: parseFloat(newAmount) || 0 })
      .eq("id", cat.id);
  };

  const deleteCategory = async (id) => {
    await supabase.from("budget_categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleQuickSetup = async () => {
    setSaving(true);
    const incomeVal = parseFloat(income) || 3000;

    // Create or update monthly budget
    if (!budget) {
      await supabase.from("monthly_budgets").insert([{
        month: monthKey,
        income: incomeVal,
        needs_target_pct: 50,
        wants_target_pct: 30,
        savings_target_pct: 20,
      }]);
    }

    const defaultBudgets = {
      "Housing": incomeVal * 0.3,
      "Food & Dining": incomeVal * 0.1,
      "Transportation": incomeVal * 0.08,
      "Utilities": incomeVal * 0.05,
      "Shopping": incomeVal * 0.07,
      "Entertainment": incomeVal * 0.06,
      "Personal": incomeVal * 0.05,
      "Savings": incomeVal * 0.2,
    };

    const toCreate = PRESET_CATEGORIES
      .filter((p) => defaultBudgets[p.name])
      .map((p) => ({
        name: p.name,
        icon: p.icon,
        color: p.color,
        type: p.type,
        budget_amount: Math.round(defaultBudgets[p.name]),
        month: monthKey,
      }));

    await supabase.from("budget_categories").insert(toCreate);

    setSaving(false);
    toast({ title: "Budget set up!" });
    loadData();
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const totalCategoryBudget = categories.reduce((s, c) => s + (c.budget_amount || 0), 0);

  return (
    <div className="px-4 pt-6 space-y-5">
      {/* Month Selector + Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Budget Settings</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-full hover:bg-muted">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium min-w-[90px] text-center">{format(currentMonth, "MMM yyyy")}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-full hover:bg-muted">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Income & Split */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50 space-y-4">
        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Monthly Income</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="pl-7 text-lg font-semibold" placeholder="0" />
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Budget Split</Label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-blue-600 font-medium mb-1">Needs %</p>
              <Input type="number" value={needsPct} onChange={(e) => setNeedsPct(e.target.value)} className="text-center" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-medium mb-1">Wants %</p>
              <Input type="number" value={wantsPct} onChange={(e) => setWantsPct(e.target.value)} className="text-center" />
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-medium mb-1">Savings %</p>
              <Input type="number" value={savingsPct} onChange={(e) => setSavingsPct(e.target.value)} className="text-center" />
            </div>
          </div>
        </div>

        <Button onClick={saveBudget} disabled={!income || saving} className="w-full">
          {saving ? "Saving..." : budget ? "Update Budget" : "Set Budget"}
        </Button>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Categories</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Total: ${totalCategoryBudget.toLocaleString()} {income && `of $${parseFloat(income).toLocaleString()}`}
            </p>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="text-base">{cat.icon || "•"}</span>
                <span className="flex-1 text-sm font-medium truncate">{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${
                  cat.type === "needs" ? "bg-blue-50 text-blue-600" :
                  cat.type === "wants" ? "bg-amber-50 text-amber-600" :
                  "bg-emerald-50 text-emerald-600"
                }`}>
                  {cat.type}
                </span>
                <div className="relative w-20">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                  <Input
                    type="number"
                    defaultValue={cat.budget_amount}
                    onBlur={(e) => updateCategoryBudget(cat, e.target.value)}
                    className="pl-5 h-8 text-sm text-right"
                  />
                </div>
                <button onClick={() => deleteCategory(cat.id)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">No categories set up</p>
            <Button variant="outline" size="sm" onClick={handleQuickSetup} disabled={saving}>
              ✨ Quick Setup (Recommended)
            </Button>
          </div>
        )}

        <button
          onClick={() => setShowAddCat(true)}
          className="w-full mt-3 py-2.5 rounded-xl border-2 border-dashed border-border text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add Category
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-500 hover:text-red-600 font-medium"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>

      {/* Add Category Dialog */}
      <Dialog open={showAddCat} onOpenChange={setShowAddCat}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Category</Label>
              <Select value={newCatName} onValueChange={setNewCatName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_CATEGORIES.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.icon} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Budget Amount ($)</Label>
              <Input type="number" placeholder="0" value={newCatBudget} onChange={(e) => setNewCatBudget(e.target.value)} />
            </div>
            <Button onClick={addCategory} disabled={!newCatName || !newCatBudget || saving} className="w-full">
              {saving ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}