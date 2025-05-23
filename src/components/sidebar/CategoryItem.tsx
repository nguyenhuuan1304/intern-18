import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Category } from "../product/types/ProductType";

interface CategoryItemProps {
  category: Category;
  level?: number;
  onSubmenuOpen?: (id: string) => void;
  onCategorySelect?: (slug: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  level = 1,
  onSubmenuOpen = () => {},
  onCategorySelect = () => {},
}) => {
  const [submenuOpen, setSubmenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChevronClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmenuOpen(true);
    onSubmenuOpen(category.documentId);
  };

  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmenuOpen(false);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setSubmenuOpen(false);
      onCategorySelect(category.slug);
    }
  };

  return (
    <div
      className="relative border-t first:border-t-0 bg-white"
      onMouseEnter={() => {
        if (!isMobile) setSubmenuOpen(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setSubmenuOpen(false);
      }}
    >
      <div className="flex items-center justify-between">
        <Link
          to={`/product/${category.slug}`}
          className="block flex-1 p-3 hover:bg-gray-100"
          onClick={handleLinkClick}
        >
          <span className="text-gray-700">{category.name.toUpperCase()}</span>
        </Link>
        {category.children && category.children.length > 0 && (
          <div className="p-3">
            {isMobile ? (
              <button onClick={handleChevronClick}>
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </button>
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </div>
        )}
      </div>

      {category.children &&
        category.children.length > 0 &&
        level < 3 &&
        (isMobile ? (
          <div
            className={`fixed top-[60px] left-0 right-0 bottom-0 bg-white z-40 transform transition-transform duration-500 ${
              submenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center p-3 border-b bg-gray-50 h-[60px]">
              <button onClick={handleBackClick} className="mr-2">
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              </button>
              <span className="font-medium">{category.name}</span>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-48px)]">
              {category.children.map((child) => (
                <CategoryItem
                  key={child.id}
                  category={child}
                  level={level + 1}
                  onSubmenuOpen={onSubmenuOpen}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            className={`absolute left-full top-0 transition-opacity duration-300 border shadow-md z-10 min-w-[200px] ${
              submenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {category.children.map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                level={level + 1}
                onSubmenuOpen={onSubmenuOpen}
              />
            ))}
          </div>
        ))}
    </div>
  );
};

export default CategoryItem;
