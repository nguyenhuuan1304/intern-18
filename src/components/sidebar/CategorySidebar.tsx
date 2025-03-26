import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { Loader2, Minus, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchCategories } from "@/store/category.slice";

const CategorySidebar: React.FC<{
  onCategorySelect: (slug: string) => void;
}> = ({ onCategorySelect }) => {
  const { categories, loading } = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState(false);
  const displayedCategories = expanded ? categories : categories.slice(0, 13);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      await dispatch(fetchCategories()).unwrap();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="spinner-border text-primary" role="status">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      </div>
    );
  return (
    <div className="w-full bg-white rounded-sm border">
      <div>
        <div className="flex flex-col">
          {displayedCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onCategorySelect={onCategorySelect}
            />
          ))}
          <div
            className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between border-t"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="font-bold">
              {expanded ? "Ẩn bớt" : "Xem thêm"}
            </span>
            <span className="mt-1">
              {expanded ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
