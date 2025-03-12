import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Category } from "./CategorySidebar";

interface CategoryItemProps {
  category: Category;
  level?: number;
  onSubmenuOpen?: (id: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  level = 1,
  onSubmenuOpen = () => {},
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

  // Khi nhấn vào ChevronRight, mở submenu và thông báo cho cha (để đóng các submenu khác nếu cần)
  const handleChevronClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Mở submenu, đồng thời hiệu ứng trượt sẽ được thực hiện nhờ CSS chuyển đổi
    setSubmenuOpen(true);
    onSubmenuOpen(category.id);
  };

  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Đóng submenu, sẽ có hiệu ứng trượt ra nhờ CSS
    setSubmenuOpen(false);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setSubmenuOpen(false);
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
          to={category.path}
          className="block flex-1 p-3 hover:bg-gray-100"
          onClick={handleLinkClick}
        >
          <span className="text-gray-700">{category.name}</span>
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
          // Với mobile: luôn render submenu, nhưng điều chỉnh vị trí qua CSS transform để tạo hiệu ứng trượt
          <div
            className={`fixed inset-0 bg-white z-50 transform transition-transform duration-500 ${
              submenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center p-3 border-b bg-gray-50">
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
          // Với desktop: hiển thị submenu theo hover với hiệu ứng opacity
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
