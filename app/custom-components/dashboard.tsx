// components/dashboard.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  PieChart,
  Pie,
  Cell,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useFinance } from "@/app/context/FinanceContext";

// Helper function to format currency
const formatCurrency = (value: number) =>
  `$${Math.abs(value).toLocaleString()}`;

const SummaryCard = ({
  title,
  value,
  trend,
  icon,
  trendValue,
}: {
  title: string;
  value: number;
  trend: "up" | "down";
  icon: React.ReactNode;
  trendValue: number;
}) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="rounded-full bg-slate-100 p-2">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{formatCurrency(value)}</div>
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        {trend === "up" ? (
          <TrendingUp className="text-emerald-500" size={16} />
        ) : (
          <TrendingDown className="text-rose-500" size={16} />
        )}
        <span className={trend === "up" ? "text-emerald-500" : "text-rose-500"}>
          {trendValue}% from last month
        </span>
      </div>
    </CardContent>
  </Card>
);

const TransactionItem = ({
  transaction,
}: {
  transaction: {
    id: string;
    type: "income" | "expense";
    description?: string;
    category: string;
    date: string;
    amount: number;
  };
}) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100">
    <div className="flex items-center gap-3">
      <div className="rounded-full bg-slate-100 p-2">
        {transaction.type === "income" ? (
          <DollarSign size={16} />
        ) : (
          <DollarSign size={16} className="rotate-180" />
        )}
      </div>
      <div>
        <p className="font-medium text-sm">{transaction.description ?? ""}</p>
        <p className="text-xs text-slate-500">
          {transaction.category} • {transaction.date}
        </p>
      </div>
    </div>
    <div
      className={`font-mono font-medium ${
        transaction.type === "expense" ? "text-rose-500" : "text-emerald-500"
      }`}
    >
      {transaction.type === "expense" ? "-" : "+"}
      {Math.abs(transaction.amount).toFixed(2)}
    </div>
  </div>
);

export default function FinanceDashboard() {
  const { transactions, categories } = useFinance();
  const [activeChart, setActiveChart] = useState("expenses");

  // Calculate summary values
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [transactions]
  );
  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
    [transactions]
  );
  const balance = totalIncome - totalExpenses;

  // Calculate expense totals by category
  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + Math.abs(tx.amount);
      });
    return map;
  }, [transactions]);
  const topCategoryName =
    Object.keys(expenseByCategory).reduce(
      (a, b) => (expenseByCategory[a] > expenseByCategory[b] ? a : b),
      ""
    ) || "N/A";

  // Prepare monthly data for the bar chart by grouping transactions by month
  const monthlyData = useMemo(() => {
    const dataMap: Record<
      string,
      { name: string; expenses: number; income: number }
    > = {};
    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const month = date.toLocaleString("default", { month: "short" });
      if (!dataMap[month]) {
        dataMap[month] = { name: month, expenses: 0, income: 0 };
      }
      if (tx.type === "income") {
        dataMap[month].income += tx.amount;
      } else {
        dataMap[month].expenses += Math.abs(tx.amount);
      }
    });
    return Object.values(dataMap);
  }, [transactions]);

  // Prepare pie chart data for expense categories
  const categoryData = useMemo(() => {
    return Object.keys(expenseByCategory).map((catName) => {
      const category = categories.find((cat) => cat.name === catName);
      return {
        name: catName,
        value: expenseByCategory[catName],
        color: category ? category.color : "#a3a3a3",
      };
    });
  }, [expenseByCategory, categories]);

  // Get the 5 most recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 p-4 bg-slate-50">
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-bold">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                title="Total Expenses"
                value={-totalExpenses}
                trend="down"
                trendValue={12} // Replace with dynamic month-over-month percentage
                icon={<TrendingDown size={18} />}
              />
              <SummaryCard
                title="Total Income"
                value={totalIncome}
                trend="up"
                trendValue={8}
                icon={<TrendingUp size={18} />}
              />
              <SummaryCard
                title="Balance"
                value={balance}
                trend="up"
                trendValue={5}
                icon={<DollarSign size={18} />}
              />
              <SummaryCard
                title="Top Category"
                value={expenseByCategory[topCategoryName] || 0}
                trend="up"
                trendValue={3}
                icon={<DollarSign size={18} />}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly Overview Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
                <CardDescription>
                  Your income and expenses over time
                </CardDescription>
                <Tabs
                  value={activeChart}
                  onValueChange={setActiveChart}
                  className="mt-2"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(Number(value)),
                          activeChart === "expenses" ? "Expenses" : "Income",
                        ]}
                      />
                      {activeChart === "expenses" ? (
                        <Bar
                          dataKey="expenses"
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                        />
                      ) : (
                        <Bar
                          dataKey="income"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Expense Categories Pie Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Where your money goes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(Number(value)),
                          "Amount",
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="mt-4 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest financial activity
                </CardDescription>
              </div>
              <div className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                View all
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 py-3">
              <button className="w-full rounded-md border border-blue-600 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
                Add New Transaction
              </button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
