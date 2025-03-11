// components/sidebar/CategorySidebar.tsx
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CategoryItem from "./CategoryItem";

interface Category {
  id: string;
  name: string;
  path: string;
  children?: Category[];
}

const categories: Category[] = [
  { id: "1", name: "BÓNG CHUYỀN", path: "/bong-chuyen" },
  {
    id: "2",
    name: "QUẦN ÁO BÓNG ĐÁ THƯƠNG HIỆU",
    path: "/quan-ao-bong-da-thuong-hieu",
  },
  { id: "3", name: "TRẺ EM KHÔNG LOGO", path: "/tre-em-khong-logo" },
  {
    id: "4",
    name: "QUẦN ÁO BÓNG ĐÁ CÂU LẠC BỘ, ĐỘI TUYỂN",
    path: "/quan-ao-bong-da-clb-doi-tuyen",
  },
  { id: "5", name: "TRẺ EM CÂU LẠC BỘ", path: "/tre-em-cau-lac-bo" },
  { id: "6", name: "CẦU LÔNG", path: "/cau-long" },
  { id: "7", name: "PICKLEBALL", path: "/pickleball" },
  { id: "8", name: "BÓNG RỔ", path: "/bong-ro" },
  {
    id: "9",
    name: "ÁO POLO, ÁO QUẦN ĐI CHUYẾN",
    path: "/ao-polo-ao-quan-di-chuyen",
  },
  {
    id: "10",
    name: "THỦ MÔN - TRỌNG TÀI - BODY- ÁO BIB - ÁO KHOÁC",
    path: "/thu-mon-trong-tai-body-ao-bib-ao-khoac",
  },
  { id: "11", name: "GIÀY BÓNG ĐÁ", path: "/giay-bong-da" },
  { id: "12", name: "QUẢ BÓNG ĐÁ", path: "/qua-bong-da" },
  { id: "13", name: "PHỤ KIỆN THỂ THAO", path: "/phu-kien-the-thao" },
];

const CategorySidebar: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-sm border">
      <div className="bg-blue-600 text-white p-3 flex items-center font-medium">
        <span className="ml-2">DANH MỤC SẢN PHẨM</span>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)] overflow-auto">
        <div className="flex flex-col">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
          <div className="p-3 text-blue-600 hover:bg-gray-100 cursor-pointer flex items-center justify-center border-t">
            Xem thêm
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategorySidebar;
