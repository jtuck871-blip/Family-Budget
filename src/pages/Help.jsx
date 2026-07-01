import React, { useState } from "react";
import { ChevronDown, ChevronUp, LayoutDashboard, Receipt, Target, Settings, PlusCircle, TrendingUp, Wallet } from "lucide-react";

const sections = [
  {
    icon: LayoutDashboard,
    color: "text-teal-600",
    bg: "bg-teal-50",
    title: "Dashboard",
    steps: [
      "The Dashboard is your financial home screen — it shows this month's spending at a glance.",
      "Use the ← → arrows at the top to navigate between months.",
      "The donut chart shows how your spending is split across categories vs. your total budget.",
      "The Cash Flow card shows your income minus spending and the needs / wants / savings breakdown.",
      "Tap the green + button (bottom-right) to quickly log a new transaction from any screen.",
    ],
  },
  {
    icon: Receipt,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Transactions",
    steps: [
      "All your recorded income and expenses live here, sorted by date.",
      "Each transaction shows the merchant, amount, date, and category.",
      "Use the search bar to filter by merchant name.",
      "Tap the category tabs (All / Needs / Wants / Savings / Income) to filter by type.",
      "Swipe or tap the trash icon on a transaction to delete it.",
    ],
  },
  {
    icon: Target,
    color: "text-purple-600",
    bg: "bg-purple-50",
    title: "Savings Goals",
    steps: [
      "Track specific savings targets like an emergency fund, vacation, or gadget purchase.",
      "Tap '+ New Goal' to create a goal — give it a name, target amount, and an emoji icon.",
      "Each goal card shows a progress bar and how much you've saved so far.",
      "Tap 'Add Funds' on a goal to record a contribution toward it.",
      "The summary header shows your overall progress across all goals.",
    ],
  },
  {
    icon: Settings,
    color: "text-orange-600",
    bg: "bg-orange-50",
    title: "Budget Settings",
    steps: [
      "Set your monthly income so the app can calculate spending percentages accurately.",
      "Adjust the target split between Needs, Wants, and Savings (must total 100%).",
      "Add custom budget categories (e.g. 'Groceries', 'Netflix') and assign a monthly limit.",
      "Use 'Quick Setup' to auto-populate sensible default categories in one tap.",
      "Switch months with the arrows to set different budgets for each month.",
    ],
  },
  {
    icon: PlusCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    title: "Logging Transactions",
    steps: [
      "Tap the green + button on the Dashboard or Transactions page.",
      "Enter the merchant name and amount (positive number).",
      "Pick a date — it defaults to today.",
      "Select a category type: Needs, Wants, Savings, or Income.",
      "Optionally choose a specific category from the dropdown for more detail.",
      "Tap 'Save Transaction' to record it. The dashboard updates immediately.",
    ],
  },
  {
    icon: TrendingUp,
    color: "text-rose-600",
    bg: "bg-rose-50",
    title: "Understanding the 50/30/20 Rule",
    steps: [
      "DollarWise is built around the popular 50/30/20 budgeting framework.",
      "Needs: ~50% of income — rent, groceries, utilities, transport.",
      "Wants: ~30% of income — dining out, subscriptions, hobbies.",
      "Savings: ~20% of income — emergency fund, investments, goals.",
      "You can customize these percentages in Budget Settings to match your lifestyle.",
    ],
  },
  {
    icon: Wallet,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "Tips for Best Results",
    steps: [
      "Log transactions as they happen — it takes just a few seconds.",
      "Set your income and budget categories at the start of each month.",
      "Check the Dashboard weekly to catch overspending early.",
      "Use Savings Goals to stay motivated toward bigger financial targets.",
      "Review the Cash Flow card to see if you're living within your means.",
    ],
  },
];

function Section({ section }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className={`w-9 h-9 rounded-xl ${section.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${section.color}`} />
        </div>
        <span className="flex-1 font-semibold text-foreground">{section.title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <ul className="space-y-2 pl-1">
            {section.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className={`mt-0.5 w-4 h-4 rounded-full ${section.bg} ${section.color} text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Help() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-foreground font-heading">Help & Guide</h1>
        <p className="text-muted-foreground text-sm mt-1 mb-6">
          Everything you need to make the most of DollarWise.
        </p>
        <div className="space-y-3">
          {sections.map((s) => (
            <Section key={s.title} section={s} />
          ))}
        </div>
      </div>
    </div>
  );
}