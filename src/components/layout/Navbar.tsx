// components/layout/Navbar.tsx
import React from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <header className="border-b">
      {/* Top Navigation */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <span className="text-2xl font-bold text-blue-600">Kawin</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-grow mx-6 max-w-2xl">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm"
                className="w-full border rounded-md pl-3 pr-10 py-2"
              />
              <Button
                variant="default"
                className="absolute right-0 top-0 bottom-0 bg-blue-600 text-white rounded-r-md"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* User Links */}
          <div className="flex items-center space-x-4">
            <Link to="/tracking" className="text-sm flex items-center">
              <span>Kiểm tra đơn hàng</span>
            </Link>
            <Link to="/register" className="text-sm flex items-center">
              <span>Đăng ký</span>
            </Link>
            <Link to="/login" className="text-sm flex items-center">
              <span>Đăng nhập</span>
            </Link>
            <Link to="/cart" className="text-sm flex items-center">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  0
                </span>
              </div>
              <span className="ml-1">Giỏ hàng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Menu Navigation */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Link to="/" className="px-4 py-3 hover:bg-blue-700">
              TRANG CHỦ
            </Link>
            <Link to="/products" className="px-4 py-3 hover:bg-blue-700">
              SẢN PHẨM
            </Link>
            <Link to="/contact" className="px-4 py-3 hover:bg-blue-700">
              LIÊN HỆ
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
