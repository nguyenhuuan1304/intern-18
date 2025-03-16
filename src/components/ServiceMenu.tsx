import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import delivery from "@/assets/delivery-man-1.webp";
import debit from "@/assets/debit-card-1.webp";
import customer from "@/assets/customer-support-1.webp";

const ServiceMenu: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap gap-2 justify-center sm:justify-between ">
        <Button className="bg-[#0590f9] hover:bg-[#0470c8] text-white flex items-center gap-2 justify-center w-full sm:w-auto sm:flex-1 lg:w-[256px] h-[45px] ">
          <Menu className="w-4 h-4" />
          DANH MỤC SẢN PHẨM
        </Button>

        <Button className="bg-[#0590f9] hover:bg-[#0470c8] text-white flex items-center gap-2 justify-center w-full sm:w-auto sm:flex-1 lg:w-[256px] h-[45px]">
          <img src={delivery} alt="Delivery" className="w-6 h-6" />
          CHẤT LƯỢNG ĐẢM BẢO
        </Button>

        <Button className="bg-[#0590f9] hover:bg-[#0470c8] text-white flex items-center gap-2 justify-center w-full sm:w-auto sm:flex-1 lg:w-[256px] h-[45px]">
          <img src={debit} alt="Debit" className="w-6 h-6" />
          PHÂN PHỐI SỈ TOÀN QUỐC
        </Button>

        <Button className="bg-[#0590f9] hover:bg-[#0470c8] text-white flex items-center gap-2 justify-center w-full sm:w-auto sm:flex-1 lg:w-[256px] h-[45px]">
          <img src={customer} alt="Customer" className="w-6 h-6" />
          MẶT HÀNG ĐA DẠNG
        </Button>

        <Button className="bg-[#0590f9] hover:bg-[#0470c8] text-white flex items-center gap-2 justify-center w-full sm:w-auto sm:flex-1 lg:w-[256px] h-[45px]">
          <img src={delivery} alt="Delivery" className="w-6 h-6" />
          GIAO HÀNG NHANH CHÓNG
        </Button>
      </div>
    </div>
  );
};

export default ServiceMenu;
