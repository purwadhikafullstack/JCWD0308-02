"use client";
import React, { useEffect, useState } from "react";
import { fetchCategories, deleteCategory, updateCategory, createCategory } from "@/lib/fetch-api/category/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CreateCategoryForm } from "./_components/create-category/CreateCategoryForm";
import { EditCategoryForm } from "./_components/update-category/EditCategoryForm";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Category } from "@/lib/types/category";
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { handleApiError, showSuccess } from "@/components/toast/toastutils";
import DeleteCategoryDialog from "./_components/dialogs/DeleteCategoriesDialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/fetch-api/user/client";

const DEFAULT_ICON_URL = "/default-icon.png";
const DEFAULT_IMAGE_URL = "/default-image-category.jpg";

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [creatingCategory, setCreatingCategory] = useState<boolean>(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const userProfile = useSuspenseQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  const isStoreAdmin = userProfile.data?.user?.role === "STORE_ADMIN";

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const handleCreate = async (formData: FormData) => {
    try {
      const createdCategory = await createCategory(formData);
      setCategories([createdCategory, ...categories]);
      setCreatingCategory(false);
      showSuccess("Category created successfully!");
    } catch (error) {
      handleApiError(error, "Failed to create category");
    }
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    try {
      const result = await updateCategory(id, formData);
      setCategories(categories.map((cat) => (cat.id === result.id ? result : cat)));
      setSelectedCategory(null);
      showSuccess("Category updated successfully!");
    } catch (error) {
      handleApiError(error, "Failed to update category");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loader"></span>
      </div>
    );

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-primary">Categories</h2>
      {!isStoreAdmin && (
        <Button onClick={() => setCreatingCategory(true)} className="mb-4">
          Create Category
        </Button>
      )}
      <Dialog open={creatingCategory} onOpenChange={setCreatingCategory}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Create Category</DialogTitle>
            <DialogDescription className="mb-4">Fill in the form below to create a new category.</DialogDescription>
          </DialogHeader>
          <CreateCategoryForm handleClose={() => setCreatingCategory(false)} onSave={handleCreate} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <Card key={category.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex items-center ">
              <div className="flex-shrink-0 w-16 h-16">
                <Image src={category.iconUrl || DEFAULT_ICON_URL} alt="Icon" width={64} height={64} className="object-cover w-16 h-16" style={{ width: "64px", height: "64px" }} />
              </div>
              <CardTitle className="text-primary text-2xl font-bold">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center mb-2">
              <div className="w-full h-48 relative">
                <Image src={category.imageUrl || DEFAULT_IMAGE_URL} alt="Image" layout="fill" objectFit="cover" className="rounded-lg" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {!isStoreAdmin && (
                <>
                  <Dialog open={selectedCategory?.id === category.id} onOpenChange={(open) => open || setSelectedCategory(null)}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" onClick={() => setSelectedCategory(category)}>
                        <FaEdit />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-primary">Edit Category</DialogTitle>
                        <DialogDescription className="mb-4">Update the category details below.</DialogDescription>
                      </DialogHeader>
                      <EditCategoryForm category={category} handleClose={() => setSelectedCategory(null)} onSave={handleUpdate} />
                    </DialogContent>
                  </Dialog>

                  <Button variant="destructive" onClick={() => setDeletingCategory(category)}>
                    <FaTrashAlt />
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {deletingCategory && <DeleteCategoryDialog category={deletingCategory} onClose={() => setDeletingCategory(null)} onDeleteSuccess={() => setCategories(categories.filter((cat) => cat.id !== deletingCategory.id))} />}
    </div>
  );
};

export default CategoryList;
