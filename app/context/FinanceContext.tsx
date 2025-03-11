// context/FinanceContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

export type Transaction = {
  id: string;
  amount: number;
  date: string;
  description?: string;
  category: string;
  type: "income" | "expense";
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Budget = {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
};

interface FinanceContextProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextProps | undefined>(
  undefined
);

export const FinanceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: 3200,
      date: "2025-03-06",
      description: "Salary",
      category: "Income",
      type: "income",
    },
    {
      id: "2",
      amount: -1200,
      date: "2025-03-08",
      description: "Monthly rent",
      category: "Rent",
      type: "expense",
    },
    {
      id: "3",
      amount: -120.5,
      date: "2025-03-10",
      description: "Grocery shopping",
      category: "Food",
      type: "expense",
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Food", color: "#0ea5e9" },
    { id: "2", name: "Rent", color: "#8b5cf6" },
    { id: "3", name: "Income", color: "#10b981" },
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { id: "1", category: "Food", budgetAmount: 500, spentAmount: 120 },
    { id: "2", category: "Rent", budgetAmount: 1200, spentAmount: 1200 },
  ]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === transaction.id ? transaction : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (category: Category) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === category.id ? category : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const addBudget = (budget: Budget) => {
    setBudgets((prev) => [...prev, budget]);
  };

  const updateBudget = (budget: Budget) => {
    setBudgets((prev) => prev.map((b) => (b.id === budget.id ? budget : b)));
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addBudget,
        updateBudget,
        deleteBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
