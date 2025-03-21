import React from "react";
// Giả sử bạn đã cài shadcn/ui
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
// Lucide React icon

const AuthSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="py-8 px-4 text-center bg-gradient-to-r from-red-400 to-red-100 h-[204px]">
      {/* Tiêu đề */}
      <h2
        className="text-2xl font-bold mb-6 text-white"
        style={{ fontFamily: "'Hemi Head', sans-serif" }} // Hoặc font tuỳ ý
      >
        Đăng ký, đăng nhập để mua hàng sỉ
      </h2>

      {/* Nút đăng nhập / đăng ký */}
      <div className="flex justify-center gap-4">
        {/* Nút Đăng nhập */}
        <Button className="relative overflow-hidden group text-sm w-[145px] h-[45px] bg-blue-600 hover:bg-blue-600 text-white shadow-none"
        onClick={() => navigate("/login")}
        >
          {/* Phần chữ */}
          <span className="relative z-10 transition-colors duration-300 group-hover:text-blue-600">
            ĐĂNG NHẬP
          </span>
          {/* Overlay trắng trượt qua với border và border radius */}
          <span className="border border-blue-600 rounded-md absolute top-0 left-0 w-full h-full bg-white transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
        </Button>

        {/* Nút Đăng ký */}
        <Button className="relative overflow-hidden group text-sm w-[145px] h-[45px] bg-red-600 hover:bg-red-600 text-white shadow-none"
        onClick={() => navigate("/register")}
        >
          {/* Phần chữ */}
          <span className="relative z-10 transition-colors duration-300 group-hover:text-red-600">
            ĐĂNG KÝ
          </span>
          {/* Overlay trắng trượt qua với border và border radius */}
          <span className="border border-red-600 rounded-md absolute top-0 left-0 w-full h-full bg-white transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
        </Button>
      </div>
    </section>
  );
};

export default AuthSection;
