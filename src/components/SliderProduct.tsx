import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchProducts } from "@/store/productSlice";
// Import ảnh (ví dụ)
import banner1 from "@/assets/anh-banner-1.webp";
import banner2 from "@/assets/anh-banner-2.webp";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SliderProduct: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const sliderData = products
    .filter((item) => item.Image && item.Image.length > 0)
    .slice(0, 15);

  const [navStart, setNavStart] = useState(0);
  const navigate = useNavigate();
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  // Tự động chuyển slide 5s/lần
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [sliderData]);

  useEffect(() => {
    if (currentIndex < navStart) {
      setNavStart(currentIndex);
    } else if (currentIndex >= navStart + 4) {
      setNavStart(currentIndex - 3);
    }
  }, [currentIndex, navStart]);
  useEffect(() => {
    dispatch(fetchProducts()).unwrap();
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  const currentItem = sliderData[currentIndex];
  const imageUrl =
    currentItem?.Image && currentItem?.Image?.length > 0
      ? currentItem?.Image[0]?.url || ""
      : "";
  return (
    <div className="max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Slider */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[16/9] h-[465px] w-full"
              >
                <div
                  className="absolute inset-0 w-full h-full cursor-pointer "
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundColor: "#f3f4f6",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                  onClick={() => navigate(currentItem.slug)}
                />
              </motion.div>
            </AnimatePresence>
            {/* Nút điều hướng */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thanh điều hướng tiêu đề, nằm bên dưới ảnh với khoảng cách 50px */}
          <div className="mt-[50px] flex justify-center gap-4">
            {sliderData.slice(navStart, navStart + 4).map((item, idx) => {
              const actualIndex = navStart + idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(actualIndex)}
                  className={`px-3 py-1 rounded transition-colors ${
                    actualIndex === currentIndex
                      ? " text-red-600"
                      : " text-gray-600"
                  }`}
                >
                  <span className="text-sm line-clamp-2">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promotional Banners (cột bên phải) */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <motion.img
              src={banner1}
              alt="Banner 1"
              whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <motion.img
              src={banner2}
              alt="Banner 2"
              whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderProduct;
