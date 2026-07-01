import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, DollarSign, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SavingsGoalCard from "@/components/budget/SavingsGoalCard";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showContribute, setShowContribute] = useState(null);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [contributeAmount, setContributeAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const loadGoals = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("savings_goals")
      .select("*")
      .order("created_at", { ascending: false });

    setGoals(data || []);
    setLoading(false);
  };

  useEffect(() => { loadGoals(); }, []);

  const handleAdd = async () => {
    if (!name || !target) return;
    setSaving(true);

    await supabase.from("savings_goals").insert([{
      name,
      target_amount: parseFloat(target),
      icon,
      current_amount: 0,
    }]);

    setSaving(false);
    setName(""); setTarget(""); setIcon("🎯");
    setShowAdd(false);
    loadGoals();
  };

  const handleContribute = async () => {
    if (!contributeAmount || !showContribute) return;
    setSaving(true);

    const goal = showContribute;
    const newAmount = (goal.current_amount || 0) + parseFloat(contributeAmount);

    await supabase
      .from("savings_goals")
      .update({ current_amount: newAmount })
      .eq("id", goal.id);

    setSaving(false);
    setContributeAmount("");
    setShowContribute(null);
    loadGoals();
  };

  const handleDelete = async (id) => {
    await supabase.from("savings_goals").delete().eq("id", id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const ICON_OPTIONS = ["🎯", "🏦", "🏠", "✈️", "🚗", "🎓", "💍", "📱", "🎉", "❤️"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const totalSaved = goals.reduce((s, g) => s + (g.current_amount || 0), 0);
  const totalTarget = goals.reduce((s, g) => s + (g.target_amount || 0), 0);

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold mb-2">Savings Goals</h1>

      {/* Summary */}
      {goals.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white mb-5">
          <p className="text-sm font-medium opacity-80">Total Saved</p>
          <p className="text-3xl font-bold mt-1">${totalSaved.toLocaleString()}</p>
          <p className="text-sm opacity-80 mt-1">of ${totalTarget.toLocaleString()} total goal</p>
          <div className="w-full bg-white/20 rounded-full h-2 mt-3">
            <div
              className="h-2 rounded-full bg-white transition-all duration-500"
              style={{ width: `${totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Goals List */}
      {goals.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-border/50 px-4 divide-y divide-border/50">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center gap-2">
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowContribute(goal)}>
                <SavingsGoalCard goal={goal} />
              </div>
              <button onClick={() => handleDelete(goal.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50 text-center">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-semibold mb-1">No savings goals yet</p>
          <p className="text-sm text-muted-foreground mb-4">Start saving toward something meaningful!</p>
        </div>
      )}

      {/* Add Button */}
      <button
        onClick={() => setShowAdd(true)}
        className="w-full mt-4 py-3 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add New Goal
      </button>

      {/* Add Goal Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Savings Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Goal Name</Label>
              <Input placeholder="e.g. Emergency Fund" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Target Amount ($)</Label>
              <Input type="number" placeholder="0.00" value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-medium mb-2 block">Icon</Label>
              <div className="flex gap-2 flex-wrap">
                {ICON_OPTIONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setIcon(ic)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                      icon === ic ? "bg-primary/10 ring-2 ring-primary" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleAdd} disabled={!name || !target || saving} className="w-full">
              {saving ? "Creating..." : "Create Goal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contribute Dialog */}
      <Dialog open={!!showContribute} onOpenChange={() => setShowContribute(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to {showContribute?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Current: ${(showContribute?.current_amount || 0).toLocaleString()} / ${(showContribute?.target_amount || 0).toLocaleString()}
            </p>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Amount to Add ($)</Label>
              <Input type="number" placeholder="0.00" value={contributeAmount} onChange={(e) => setContributeAmount(e.target.value)} />
            </div>
            <Button onClick={handleContribute} disabled={!contributeAmount || saving} className="w-full">
              <DollarSign className="w-4 h-4 mr-1" /> {saving ? "Adding..." : "Add Contribution"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}