import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import ảnh (ví dụ)
import banner1 from "@/assets/anh-banner-1.webp";
import banner2 from "@/assets/anh-banner-2.webp";
import giaycaulongkitto from "@/assets/giay-cau-long-kitto.png";
import giaybongchuyencaptainbeyono from "@/assets/giay-bong-chuyen-captain-beyono.webp";
import more20mikal from "@/assets/more-2.0-mikal.webp";
import pannsatii from "@/assets/passat-ii.webp";
import quanaobongdapanther2jp from "@/assets/quan-ao-bong-da-panther-2jp.webp";
import quanaobongdaragebeyono from "@/assets/quan-ao-bong-da-rage-beyono.webp";
import quanaodoituyenvietnam from "@/assets/quan-ao-doi-tuyen-viet-nam.webp";
import votkumpoo from "@/assets/vot-kumpoo.webp";
import sancacmadangiamgia from "@/assets/san-cac-ma-dang-giam-gia.webp";
import thunderjustplay from "@/assets/thunder-just-play.webp";
import bongchuyenbenteyo from "@/assets/bongchuyenbenteyo.webp";
import btsvalorcv from "@/assets/btsvalorcv.webp";
import { useNavigate } from "react-router-dom";

// Dữ liệu slider
const bannerData = [
  {
    id: 1,
    title: "GIÀY CẦU LÔNG KITTO",
    image: giaycaulongkitto,
    path: "giay-cau-long-kitto",
  },
  {
    id: 2,
    title: "MORED 2.0 MIKAL",
    image: more20mikal,
    path: "mored-2.0-mikal",
  },
  {
    id: 3,
    title: "VỢT KUMPOO K520 PRO",
    image: votkumpoo,
    path: "vot-kumpoo-k520-pro",
  },
  {
    id: 4,
    title: "QUẦN ÁO ĐỘI TUYỂT VIỆT NAM",
    image: quanaodoituyenvietnam,
    path: "quan-ao-doi-tuyen-viet-nam",
  },
  {
    id: 5,
    title: "GIÀY BÓNG CHUYỀN CAPTAIN BEYONO",
    image: giaybongchuyencaptainbeyono,
    path: "giay-bong-chuyen-captain-beyono",
  },
  {
    id: 6,
    title: "QUẦN ÁO BÓNG ĐÁ PANTHER 2JP",
    image: quanaobongdapanther2jp,
    path: "quan-ao-bong-da-panther-2jp",
  },
  {
    id: 7,
    title: "QUẦN ÁO BÓNG ĐÁ RAGE BEYONO",
    image: quanaobongdaragebeyono,
    path: "quan-ao-bong-da-rage-beyono",
  },
  { id: 8, title: "BTS VALOR CV", image: btsvalorcv, path: "bts-valor-cv" },
  {
    id: 9,
    title: "SĂM CÁC MÃ ĐANG GIẢM GIÁ",
    image: sancacmadangiamgia,
    path: "sam-cac-ma-dang-giam-gia",
  },
  {
    id: 10,
    title: "THUNDER JUSTPLAY",
    image: thunderjustplay,
    path: "thunder-justplay",
  },
  {
    id: 11,
    title: "BÓNG CHUYỀN BENTEYO JUSTPLAY",
    image: bongchuyenbenteyo,
    path: "bong-chuyen-benteyo-justplay",
  },
  {
    id: 12,
    title: "PASSAT II JUSTPLAY",
    image: pannsatii,
    path: "passat-ii-justplay",
  },
];


// Banner khuyến mãi bên phải
const promotions = [
  { id: 1, image: banner1 },
  { id: 2, image: banner2 },
];

const SliderProduct: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // navStart quản lý chỉ số bắt đầu của window hiển thị 4 tiêu đề
  const [navStart, setNavStart] = useState(0);
 const navigate = useNavigate()
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? bannerData.length - 1 : prev - 1));
  };

  // Tự động chuyển slide 5s/lần
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  // Cập nhật navStart nếu currentIndex nằm ngoài window hiển thị 4 tiêu đề
  useEffect(() => {
    if (currentIndex < navStart) {
      setNavStart(currentIndex);
    } else if (currentIndex >= navStart + 4) {
      setNavStart(currentIndex - 3);
    }
  }, [currentIndex, navStart]);

  return (
    <div className="max-w-7xl  px-4 py-8">
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
                className="relative aspect-[16/9] h-[465px]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${bannerData[currentIndex].image})`,
                    backgroundColor: "#f3f4f6",
                  }}
                  onClick={() => navigate(bannerData[currentIndex].path)}
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
            {bannerData.slice(navStart, navStart + 4).map((item, idx) => {
              const actualIndex = navStart + idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(actualIndex)}
                  className={`px-3 py-1 rounded transition-colors ${
                    actualIndex === currentIndex
                      ? " text-red-600 "
                      : " text-gray-600"
                  }`}
                >
                  <span className="text-sm line-clamp-2">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promotional Banners (cột bên phải) */}
        <div className="flex flex-col gap-4">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="relative overflow-hidden rounded-xl shadow-lg"
            >
              <motion.img
                src={promo.image}
                alt={`Banner ${promo.id}`}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.3 },
                }}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderProduct;
