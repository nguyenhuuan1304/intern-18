// components/sidebar/CategoryItem.tsx
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  path: string;
  children?: Category[];
}

interface CategoryItemProps {
  category: Category;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    if (category.children && category.children.length > 0) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="border-t first:border-t-0">
      <Link to={category.path}>
        <div 
          className="p-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
          onClick={toggleOpen}
        >
          <span className="text-gray-700">{category.name}</span>
          <ChevronRight className="h-4 w-4 text-gray-500" />
        </div>
      </Link>
      {isOpen && category.children && (
        <div className="pl-4 bg-gray-50">
          {category.children.map((child) => (
            <CategoryItem key={child.id} category={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;