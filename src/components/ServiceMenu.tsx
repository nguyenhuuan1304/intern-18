import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Truck, CreditCard, Users, PackageCheck } from "lucide-react";
import CategorySidebar from "@/components/sidebar/CategorySidebar";
import { useLocation } from "react-router-dom";

const ServiceMenu: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [showCategory, setShowCategory] = useState(false);

  const handleMouseEnter = () => {
    if (!isHomePage) setShowCategory(true);
  };

  const handleMouseLeave = () => {
    if (!isHomePage) setShowCategory(false);
  };

  return (
    <div className="container mx-auto px-4 relative">
      <div className="flex flex-wrap gap-2 justify-center sm:justify-between">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button className="bg-[#0590f9] hover:bg-[#0470c8] text-white flex items-center gap-2 justify-center w-full sm:w-auto sm:flex-1 lg:w-[256px] h-[45px]">
            <Menu className="w-4 h-4" />
            DANH MỤC SẢN PHẨM
          </Button>
          {!isHomePage && showCategory && (
            <div className="absolute top-full left-0 z-50">
              <div className="flex justify-center">
                <div className="w-[250px] h-2 bg-white" />
              </div>
              <CategorySidebar />
            </div>
          )}
        </div>

        <Button className="bg-[#0590f9] hover:bg-[#0470c8] text-white flex items-center gap-2 justify-center w-full sm:w-auto sm:flex-1 lg:w-[256px] h-[45px]">
          <Truck className="w-5 h-5" />
          CHẤT LƯỢNG ĐẢM BẢO
        </Button>

        <Button className="bg-[#0590f9] hover:bg-[#0470c8] text-white flex items-center gap-2 justify-center w-full sm:w-auto sm:flex-1 lg:w-[256px] h-[45px]">
          <CreditCard className="w-5 h-5" />
          PHÂN PHỐI SỈ TOÀN QUỐC
        </Button>

        <Button className="bg-[#0590f9] hover:bg-[#0470c8] text-white flex items-center gap-2 justify-center w-full sm:w-auto sm:flex-1 lg:w-[256px] h-[45px]">
          <Users className="w-5 h-5" />
          MẶT HÀNG ĐA DẠNG
        </Button>

        <Button className="bg-[#0590f9] hover:bg-[#0470c8] text-white flex items-center gap-2 justify-center w-full sm:w-auto sm:flex-1 lg:w-[256px] h-[45px]">
          <PackageCheck className="w-5 h-5" />
          GIAO HÀNG NHANH CHÓNG
        </Button>
      </div>
    </div>
  );
};

export default ServiceMenu;
