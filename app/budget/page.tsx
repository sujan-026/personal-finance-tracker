// app/budget/page.tsx
"use client";

import { useState } from "react";
import Layout from "@/app/custom-components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Trash2 } from "lucide-react";

// Zod schema for budget validation
const budgetSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  budgetAmount: z
    .number({
      required_error: "Budget amount is required",
      invalid_type_error: "Budget amount must be a number",
    })
    .min(0, "Must be non-negative"),
  spentAmount: z
    .number({
      required_error: "Spent amount is required",
      invalid_type_error: "Spent amount must be a number",
    })
    .min(0, "Must be non-negative"),
});

type Budget = z.infer<typeof budgetSchema>;

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Budget>({
    resolver: zodResolver(budgetSchema),
  });

  const onSubmit = (data: Budget) => {
    if (editBudget) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === editBudget.id ? { ...data, id: editBudget.id } : b
        )
      );
      setEditBudget(null);
    } else {
      const newBudget = { ...data, id: Date.now().toString() };
      setBudgets((prev) => [...prev, newBudget]);
    }
    reset();
  };

  const handleEdit = (budget: Budget) => {
    setEditBudget(budget);
    reset(budget);
  };

  const handleDelete = (id: string | undefined) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Budget Management</h2>
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Budget</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editBudget ? "Edit Budget" : "Add Budget"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Category</label>
                  <Input
                    type="text"
                    {...register("category")}
                    placeholder="e.g., Food"
                  />
                  {errors.category && (
                    <p className="text-sm text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Budget Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("budgetAmount", { valueAsNumber: true })}
                  />
                  {errors.budgetAmount && (
                    <p className="text-sm text-red-500">
                      {errors.budgetAmount.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Spent Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("spentAmount", { valueAsNumber: true })}
                  />
                  {errors.spentAmount && (
                    <p className="text-sm text-red-500">
                      {errors.spentAmount.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset();
                      setEditBudget(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editBudget ? "Update" : "Add"}</Button>
                </div>
              </form>
              <DialogFooter />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4">
          {budgets.map((b) => (
            <Card key={b.id} className="shadow-sm">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg">{b.category}</CardTitle>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(b)} title="Edit">
                    <Edit size={18} className="text-blue-500" />
                  </button>
                  <button onClick={() => handleDelete(b.id)} title="Delete">
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Budget: ${b.budgetAmount.toFixed(2)} | Spent: $
                  {b.spentAmount.toFixed(2)}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{
                      width: `${Math.min(
                        (b.spentAmount / b.budgetAmount) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {Math.min(
                    (b.spentAmount / b.budgetAmount) * 100,
                    100
                  ).toFixed(0)}
                  % used
                </p>
              </CardContent>
            </Card>
          ))}
          {budgets.length === 0 && (
            <p className="text-center text-slate-500">No budgets found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
