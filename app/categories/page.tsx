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

// Zod schema for category validation
const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
});

type Category = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Category>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = (data: Category) => {
    if (editCategory) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editCategory.id ? { ...data, id: editCategory.id } : cat))
      );
      setEditCategory(null);
    } else {
      const newCategory = { ...data, id: Date.now().toString() };
      setCategories((prev) => [...prev, newCategory]);
    }
    reset();
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    reset(category);
  };

  const handleDelete = (id: string | undefined) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editCategory ? "Edit Category" : "Add Category"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Name</label>
                  <Input type="text" {...register("name")} placeholder="e.g., Food" />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Color</label>
                  <Input type="color" {...register("color")} />
                  {errors.color && <p className="text-sm text-red-500">{errors.color.message}</p>}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset();
                      setEditCategory(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editCategory ? "Update" : "Add"}</Button>
                </div>
              </form>
              <DialogFooter />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="shadow-sm">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  <span style={{ color: cat.color }}>{cat.name}</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(cat)} title="Edit">
                    <Edit size={18} className="text-blue-500" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} title="Delete">
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Category: {cat.name}</p>
              </CardContent>
            </Card>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-slate-500">No categories found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
