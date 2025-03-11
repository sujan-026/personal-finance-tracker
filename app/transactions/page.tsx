// app/transactions/page.tsx
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
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Trash2 } from "lucide-react";

// Zod schema for transaction validation
const transactionSchema = z.object({
  id: z.string().optional(),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(0, "Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  description: z.string().max(100, "Max 100 characters").optional(),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["income", "expense"]),
});

type Transaction = z.infer<typeof transactionSchema>;

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Transaction>({
    resolver: zodResolver(transactionSchema),
  });

  const onSubmit = (data: Transaction) => {
    if (editTransaction) {
      // Update existing transaction
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === editTransaction.id
            ? { ...data, id: editTransaction.id }
            : tx
        )
      );
      setEditTransaction(null);
    } else {
      // Add new transaction (generate a unique ID)
      const newTransaction = { ...data, id: Date.now().toString() };
      setTransactions((prev) => [...prev, newTransaction]);
    }
    reset();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    reset(transaction);
  };

  const handleDelete = (id: string | undefined) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Transaction</Button>
            </DialogTrigger >
            <DialogPortal >
              <DialogOverlay className="bg-transparent" />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editTransaction ? "Edit Transaction" : "Add Transaction"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Amount</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("amount", { valueAsNumber: true })}
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-500">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Date</label>
                    <Input type="date" {...register("date")} />
                    {errors.date && (
                      <p className="text-sm text-red-500">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Description</label>
                    <Input
                      type="text"
                      {...register("description")}
                      placeholder="Optional description"
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Category</label>
                    <Input
                      type="text"
                      {...register("category")}
                      placeholder="e.g., Food, Rent"
                    />
                    {errors.category && (
                      <p className="text-sm text-red-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Type</label>
                    <select
                      {...register("type")}
                      className="p-2 border rounded"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                    {errors.type && (
                      <p className="text-sm text-red-500">
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        reset();
                        setEditTransaction(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editTransaction ? "Update" : "Add"}
                    </Button>
                  </div>
                </form>
                <DialogFooter />
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </div>
        <div className="grid gap-4">
          {transactions.map((tx) => (
            <Card key={tx.id} className="shadow-sm">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {tx.type === "expense" ? "-" : "+"}${tx.amount.toFixed(2)}
                </CardTitle>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(tx)} title="Edit">
                    <Edit size={18} className="text-blue-500" />
                  </button>
                  <button onClick={() => handleDelete(tx.id)} title="Delete">
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {tx.description} — {tx.category}
                </p>
                <p className="text-xs text-slate-500">{tx.date}</p>
              </CardContent>
            </Card>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-slate-500">No transactions found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
