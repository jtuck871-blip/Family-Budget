import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const DEFAULT_CATEGORIES = [
  { name: "Housing", type: "needs" },
  { name: "Food & Dining", type: "needs" },
  { name: "Transportation", type: "needs" },
  { name: "Utilities", type: "needs" },
  { name: "Health", type: "needs" },
  { name: "Shopping", type: "wants" },
  { name: "Entertainment", type: "wants" },
  { name: "Personal", type: "wants" },
  { name: "Education", type: "wants" },
  { name: "Savings", type: "savings" },
  { name: "Income", type: "income" },
];

export default function AddTransactionDialog({ open, onOpenChange, onSave }) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [categoryName, setCategoryName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedCat = DEFAULT_CATEGORIES.find((c) => c.name === categoryName);

  const handleSave = async () => {
    if (!merchant || !amount || !categoryName) return;
    setSaving(true);
    await onSave({
      merchant,
      amount: parseFloat(amount),
      date,
      category_name: categoryName,
      type: selectedCat?.type || "needs",
      notes,
    });
    setSaving(false);
    setMerchant("");
    setAmount("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setCategoryName("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Merchant</Label>
            <Input placeholder="e.g. Walmart, Shell, Netflix" value={merchant} onChange={(e) => setMerchant(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Amount ($)</Label>
            <Input type="number" placeholder="0.00" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Category</Label>
            <Select value={categoryName} onValueChange={setCategoryName}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_CATEGORIES.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name} <span className="text-muted-foreground ml-1 text-xs">({c.type})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Notes (optional)</Label>
            <Input placeholder="Add a note..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={!merchant || !amount || !categoryName || saving} className="w-full">
            {saving ? "Saving..." : "Add Transaction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}