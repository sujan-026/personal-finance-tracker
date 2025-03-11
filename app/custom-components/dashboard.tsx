// components/dashboard.tsx
"use client";

import { useState } from "react";
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
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Coffee,
  Home,
  Car,
} from "lucide-react";

// Sample data
const monthlyData = [
  { name: "Jan", expenses: 2400, income: 4000 },
  { name: "Feb", expenses: 1398, income: 3000 },
  { name: "Mar", expenses: 9800, income: 2000 },
  { name: "Apr", expenses: 3908, income: 2780 },
  { name: "May", expenses: 4800, income: 1890 },
  { name: "Jun", expenses: 3800, income: 2390 },
];

const categoryData = [
  { name: "Food", value: 2400, color: "#0ea5e9" },
  { name: "Rent", value: 4567, color: "#8b5cf6" },
  { name: "Transport", value: 1398, color: "#10b981" },
  { name: "Entertainment", value: 9800, color: "#f59e0b" },
  { name: "Shopping", value: 3908, color: "#ef4444" },
];

const transactions = [
  {
    id: 1,
    date: "2025-03-10",
    category: "Food",
    description: "Grocery shopping",
    amount: -120.5,
    icon: <ShoppingBag size={16} />,
  },
  {
    id: 2,
    date: "2025-03-09",
    category: "Coffee",
    description: "Starbucks",
    amount: -4.75,
    icon: <Coffee size={16} />,
  },
  {
    id: 3,
    date: "2025-03-08",
    category: "Rent",
    description: "Monthly rent",
    amount: -1200.0,
    icon: <Home size={16} />,
  },
  {
    id: 4,
    date: "2025-03-07",
    category: "Transport",
    description: "Gas",
    amount: -45.0,
    icon: <Car size={16} />,
  },
  {
    id: 5,
    date: "2025-03-06",
    category: "Income",
    description: "Salary",
    amount: 3200.0,
    icon: <DollarSign size={16} />,
  },
];

// Custom components
const SummaryCard = ({ title, value, trend, icon, trendValue }) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="rounded-full bg-slate-100 p-2">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        ${Math.abs(value).toLocaleString()}
      </div>
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

const TransactionItem = ({ transaction }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100">
    <div className="flex items-center gap-3">
      <div className="rounded-full bg-slate-100 p-2">{transaction.icon}</div>
      <div>
        <p className="font-medium text-sm">{transaction.description}</p>
        <p className="text-xs text-slate-500">
          {transaction.category} • {transaction.date}
        </p>
      </div>
    </div>
    <div
      className={`font-mono font-medium ${
        transaction.amount < 0 ? "text-rose-500" : "text-emerald-500"
      }`}
    >
      {transaction.amount < 0 ? "-" : "+"}$
      {Math.abs(transaction.amount).toFixed(2)}
    </div>
  </div>
);

const FinanceDashboard = () => {
  const [activeChart, setActiveChart] = useState("expenses");

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Main content */}
        <main className="flex-1 p-4 bg-slate-50">
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-bold">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                title="Total Expenses"
                value={-3245.5}
                trend="down"
                trendValue={12}
                icon={<TrendingDown size={18} />}
              />
              <SummaryCard
                title="Total Income"
                value={5240.0}
                trend="up"
                trendValue={8}
                icon={<TrendingUp size={18} />}
              />
              <SummaryCard
                title="Balance"
                value={1994.5}
                trend="up"
                trendValue={5}
                icon={<DollarSign size={18} />}
              />
              <SummaryCard
                title="Top Category"
                value={-1200.0}
                trend="up"
                trendValue={3}
                icon={<Home size={18} />}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly Chart */}
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
                          `$${value}`,
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

            {/* Category Chart */}
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
                      <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
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
                {transactions.map((transaction) => (
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
};

export default FinanceDashboard;
