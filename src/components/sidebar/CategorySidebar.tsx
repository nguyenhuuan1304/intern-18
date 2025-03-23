import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { Minus, Plus } from "lucide-react";
import categoryApi from "../api/category.api";
import { Category } from "../product/types/ProductType";

const CategorySidebar: React.FC<{ onCategorySelect: (slug: string) => void }> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [expanded, setExpanded] = useState(false);
  const displayedCategories = expanded ? categories : categories.slice(0, 13);
  
  useEffect(() => {
  fetchAllCategories();
  }
  , []);
 const fetchAllCategories = async () => {
   try {
     const res = await categoryApi.getAllCategories();
     const parentCategories = res.data.filter(
       (category) => category.children && category.children.length > 0
     );
     console.log(parentCategories);
    setCategories(parentCategories);
   } catch (error) {
     console.error("Error fetching categories:", error);
   }
 };

  return (
    <div className="w-full bg-white rounded-sm border">
      <div>
        <div className="flex flex-col">
          {displayedCategories.map((category) => (
            <CategoryItem key={category.id} category={category} onCategorySelect={onCategorySelect} />
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
