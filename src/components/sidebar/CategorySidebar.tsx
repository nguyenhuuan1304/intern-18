import React, { useState } from "react";
import CategoryItem from "./CategoryItem";
import { Minus, Plus } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  path: string;
  children?: Category[];
}

const categories: Category[] = [
  {
    id: "1",
    name: "BÓNG CHUYỀN",
    path: "/bong-chuyen",
    children: [
      {
        id: "1-1",
        name: "QUẦN ÁO BÓNG CHUYỀN BEYONO",
        path: "/quan-bao-bong-chuyen-beyono",
      },
      {
        id: "1-2",
        name: "QUẦN ÁO BÓNG CHUYỀN VH",
        path: "/quan-ao-bong-chuyen-vh",
      },
      {
        id: "1-3",
        name: "QUẦN ÁO BÓNG CHUYỀN VH",
        path: "/quan-ao-bong-chuyen-vh",
      },
      {
        id: "1-4",
        name: "QUẦN ÁO BÓNG CHUYỀN CV",
        path: "/quan-ao-bong-chuyen-cv",
      },
      {
        id: "1-5",
        name: "BÓNG CHUYỀN BULBAL",
        path: "/bong-chuyen-bulbal",
      },
      {
        id: "1-6",
        name: "QUẦN ÁO BÓNG CHUYỀN CP",
        path: "/quan-ao-bong-chuyen-cp",
      },
      {
        id: "1-7",
        name: "QUẦN ÁO BÓNG CHUYỀN RIKI",
        path: "/quan-ao-bong-chuyen-vh",
      },
      {
        id: "1-8",
        name: "GIÀY BÓNG CHUYỀN",
        path: "/giay-bong-chuyen",
      },
      {
        id: "1-9",
        name: "QUẢ BÓNG CHUYỀN",
        path: "/qua-bong-chuyen",
      },
    ],
  },
  {
    id: "2",
    name: "QUẦN ÁO BÓNG ĐÁ THƯƠNG HIỆU",
    path: "/quan-ao-bong-da-thuong-hieu",
    children: [
      {
        id: "2-1",
        name: "KALIX - HD",
        path: "/kalix",
        children: [
          {
            id: "2-1-1",
            name: "KHÔNG LOGO HD",
            path: "/khong-logo-hd",
          },
          {
            id: "2-1-2",
            name: "KHÔNG LOGO KALIX",
            path: "/khong-logo-kalix",
          },
        ],
      },
      {
        id: "2-2",
        name: "HP VEVOCA",
        path: "/hp-vevoca",
      },
      {
        id: "2-3",
        name: "SAO VIỆT - MIRA",
        path: "/sao-viet-mira",
      },

      {
        id: "2-4",
        name: "KEPP FLY",
        path: "/kepp-fly",
      },
      {
        id: "2-5",
        name: "MK - VH",
        path: "/mk-vh",
        children: [
          {
            id: "2-5-1",
            name: "KHÔNG LOGO VH",
            path: "/khong-logo-vh",
          },
          {
            id: "2-5-2",
            name: "KHÔNG LOGO MIKAL",
            path: "/khong-logo-mikal",
          },
        ],
      },
      {
        id: "2-6",
        name: "BULBAL",
        path: "/bulbal",
      },
      {
        id: "2-7",
        name: "JUST PLAY",
        path: "/justplay",
      },
      {
        id: "2-8",
        name: "DK DULL KILL",
        path: "/dk-dull-kill",
      },
      {
        id: "2-9",
        name: "BEYONO",
        path: "/beyono",
      },
      {
        id: "2-10",
        name: "SPEED - WIKA",
        path: "/speed-wika",
      },
      {
        id: "2-11",
        name: "RIKI - CV",
        path: "/riki-cv",
        children: [
          {
            id: "2-11-1",
            name: "KHÔNG LOGO CV",
            path: "/khong-logo-cv",
          },
          {
            id: "2-11-2",
            name: "KHÔNG LOGO RIKI",
            path: "/khong-logo-riki",
          },
        ],
      },
      {
        id: "2-12",
        name: "CP - EGAN",
        path: "/cp-egan",
        children: [
          {
            id: "2-12-1",
            name: "KHÔNG LOGO CP",
            path: "/khong-logo-cp",
          },
          {
            id: "2-12-2",
            name: "KHÔNG LOGO EGAN",
            path: "/khong-logo-egan",
          },
        ],
      },
      {
        id: "2-13",
        name: "THƯƠNG HIỆU KHÁC",
        path: "/thuong-hieu-khac",
      },
    ],
  },
  {
    id: "3",
    name: "TRẺ EM KHÔNG LOGO",
    path: "/tre-em-khong-logo",
    children: [
      {
        id: "3-1",
        name: "TRẺ EM BULBAL",
        path: "/tre-em-bulbal",
      },
      {
        id: "3-2",
        name: "TRẺ EM RIKI",
        path: "/tre-em-riki",
      },
      {
        id: "3-3",
        name: "TRẺ EM JUSTPLAY",
        path: "/tre-em-justplay",
      },
      {
        id: "3-4",
        name: "TRẺ EM BEYONO",
        path: "/tre-em-beyon",
      },
      {
        id: "3-5",
        name: "TRẺ EM CP",
        path: "/tre-em-cp",
      },
      {
        id: "3-6",
        name: "TRẺ EM KEPPFLY",
        path: "/tre-em-keppfly",
      },
    ],
  },

  {
    id: "4",
    name: "QUẦN ÁO BÓNG ĐÁ CÂU LẠC BỘ, ĐỘI TUYỂN",
    path: "/quan-ao-bong-da-clb-doi-tuyen",
    children: [
      {
        id: "4-1",
        name: "QUẦN ÁO CLB MÈ KL",
        path: "/quan-ao-clb-me-kl",
      },
      {
        id: "4-2",
        name: "CLB STRIVEND BULBAL",
        path: "/clb-strivend-bulbal",
      },
      {
        id: "4-3",
        name: "QUẦN ÁO CLB JUSTPLAY",
        path: "/quan-ao-clb-justplay",
      },
      {
        id: "4-4",
        name: "QUẦN ÁO CLB MÈ HD",
        path: "/quan-ao-clb-me-hd",
      },
      {
        id: "4-5",
        name: "QUẦN ÁO CLB MK",
        path: "/quan-ao-clb-mk",
      },
      {
        id: "4-6",
        name: "QUẦN ÁO CLB DK-HP",
        path: "/quan-ao-clb-dk-hp",
      },
      {
        id: "4-7",
        name: "QUẦN ÁO CLB SAO VIỆT",
        path: "/quan-ao-clb-sao-viet",
      },
      {
        id: "4-8",
        name: "QUẦN ÁO CLB TAY DÀI",
        path: "/quan-ao-clb-tay-dai",
      },
      {
        id: "4-9",
        name: "ÁO ĐẤU TUYỂN VIỆT NAM CHÍNH HÃNG JOGARBOLA",
        path: "/ao-dau-tuyen-viet-nam-chinh-hang-jogarbola",
      },
      {
        id: "4-10",
        name: "ĐỒ CLB F1",
        path: "/do-clb-f1",
      },
    ],
  },
  {
    id: "5",
    name: "TRẺ EM CÂU LẠC BỘ",
    path: "/tre-em-cau-lac-bo",
    children: [
      { id: "5-1", name: "TRẺ EM CLB STRIVEND", path: "/tre-em-clb-strivend" },
      { id: "5-2", name: "TRẺ EM CLB SAO VIỆT", path: "/tre-em-clb-sao-viet" },
      { id: "5-3", name: "TRẺ EM CLB JUSTPLAY", path: "/tre-em-clb-justplay" },
      { id: "5-4", name: "TRẺ EM CLB HD", path: "/tre-em-clb-hd" },
      { id: "5-5", name: "TRẺ EM CLB MK", path: "/tre-em-clb-mk" },
      { id: "5-7", name: "TRẺ EM CLB WIN", path: "/tre-em-clb-win" },
    ],
  },
  {
    id: "6",
    name: "CẦU LÔNG",
    path: "/cau-long",
    children: [
      { id: "6-1", name: "VỢT CẦU LÔNG", path: "/vot-cau-long" },
      { id: "6-2", name: "GIÀY CẦU LÔNG", path: "/giay-cau-long" },
      {
        id: "6-3",
        name: "ÁO QUẦN CẦU LÔNG",
        path: "/ao-quan-cau-long",
        children: [
          {
            id: "6-3-1",
            name: "ÁO QUẦN CẦU LÔNG RIKI",
            path: "/ao-quan-cau-long-riki",
          },
          {
            id: "6-3-2",
            name: "ÁO QUẦN CẦU LÔNG EGAN",
            path: "/ao-quan-cau-long-egan",
          },
          {
            id: "6-3-3",
            name: "ÁO QUẦN CẦU LÔNG KEEPFLY",
            path: "/ao-quan-cau-long-keepfly",
          },
          {
            id: "6-3-4",
            name: "ÁO QUẦN CẦU LÔNG JUSTPLAY",
            path: "/ao-quan-cau-long-justplay",
          },
          {
            id: "6-3-5",
            name: "ÁO QUẦN CẦU LÔNG BULBAL",
            path: "/ao-quan-cau-long-bulbal",
          },
          {
            id: "6-3-6",
            name: "ÁO QUẦN CẦU LÔNG BEYONO",
            path: "/ao-quan-cau-long-beyono",
          },
        ],
      },
    ],
  },
  {
    id: "7",
    name: "PICKLEBALL",
    path: "/pickleball",
    children: [
      { id: "7-1", name: "VỢT PICKLEBALL", path: "/vot-pickleball" },
      {
        id: "7-2",
        name: "BÓNG, LƯỚI, PHỤ KIỆN PICKLEBALL",
        path: "/bong-luoi-phu-kien-pickleball",
      },
    ],
  },
  {
    id: "8",
    name: "BÓNG RỔ",
    path: "/bong-ro",
    children: [
      { id: "8-1", name: "BÓNG RỔ NGƯỜI LỚN", path: "/bong-ro-nguoi-lon" },
      {
        id: "8-2",
        name: "BÓNG RỔ TRẺ EM",
        path: "/bong-ro-tre-em",
      },
    ],
  },
  {
    id: "9",
    name: "ÁO POLO, ÁO QUẦN ĐI CHUYẾN",
    path: "/ao-polo-ao-quan-di-chuyen",
    children: [
      { id: "9-1", name: "POLO RIKI", path: "/ao-polo-riki" },
      { id: "9-2", name: "POLO EGAN", path: "/ao-polo-egan" },
      { id: "9-3", name: "POLO BULBAL", path: "/ao-polo-bulbal" },
      { id: "9-4", name: "POLO JUST PLAY", path: "/ao-polo-justplay" },
      { id: "9-5", name: "POLO HP", path: "/ao-polo-hp" },
      { id: "9-6", name: "POLO CV", path: "/ao-polo-cv" },
      { id: "9-7", name: "POLO BEYONO", path: "/ao-polo-beyono" },
      { id: "9-8", name: "POLO DK", path: "/ao-polo-dk" },
      { id: "9-9", name: "ÁO POLO NỮ", path: "/ao-polo-nu" },
      { id: "9-10", name: "POLO KEEP FLY", path: "/ao-polo-keepfly" },
      {
        id: "9-11",
        name: "POLO SAO VIỆT VÀ HÃNG KHÁC",
        path: "/ao-polo-saoviet",
      },
      { id: "9-12", name: "QUẦN SHORT", path: "/quan-short" },
      { id: "9-13", name: "QUẦN DÀI", path: "/quan-dai" },
    ],
  },
  {
    id: "10",
    name: "THỦ MÔN - TRỌNG TÀI - BODY- ÁO BIB - ÁO KHOÁC",
    path: "/thu-mon-trong-tai-body-ao-bib-ao-khoac",
    children: [
      { id: "10-1", name: "QUẦN ÁO TRỌNG TÀI", path: "/quan-ao-trong-tai" },
      { id: "10-2", name: "QUẦN ÁO BODY", path: "/quan-ao-body" },
      { id: "10-3", name: "ÁO BIB", path: "/ao-bib" },
      { id: "10-4", name: "ÁO KHOÁC", path: "/ao-khoac" },
      { id: "10-5", name: "QUẦN ÁO THỦ MÔN", path: "/quan-ao-thu-mon" },
    ],
  },
  {
    id: "11",
    name: "GIÀY BÓNG ĐÁ",
    path: "/giay-bong-da",
    children: [
      { id: "11-1", name: "GIÀY BÓNG ĐÁ 3 SỌC", path: "/giay-bong-da-3-soc" },
      { id: "11-2", name: "GIÀY BEYONO", path: "/giay-beyono" },
      { id: "11-3", name: "GIÀY BÓNG ĐÁ F1", path: "/giay-bong-da-f1" },
      {
        id: "11-4",
        name: "GIÀY BÓNG ĐÁ MIRA - BULBAL",
        path: "/giay-bong-da-mira-bulbal",
      },
      { id: "11-5", name: "GIÀY BÓNG ĐÁ WIKA", path: "/giay-bong-da-wika" },
      {
        id: "11-6",
        name: "GIÀY BATA, BATA MÓNG",
        path: "/giay-bata-bata-mong",
      },
      {
        id: "11-7",
        name: "GIÀY BÓNG ĐÁ ĐINH CAO",
        path: "/giay-bong-da-dinh-cao",
      },
      { id: "11-8", name: "GIÀY BÓNG ĐÁ TRẺ EM", path: "/giay-bong-da-tre-em" },
      {
        id: "11-9",
        name: "GIÀY BÓNG ĐÁ KAWIN-IWIN",
        path: "/giay-bong-da-kawin-iwin",
      },
      {
        id: "11-10",
        name: "GIÀY BÓNG ĐÁ KAMITO",
        path: "/giay-bong-da-kamito",
      },
      { id: "11-11", name: "GIÀY PAN", path: "/giay-pan" },
      { id: "11-12", name: "GIÀY BÓNG ĐÁ KHÁC", path: "/giay-bong-da-khac" },
    ],
  },
  {
    id: "12",
    name: "QUẢ BÓNG ĐÁ",
    path: "/qua-bong-da",
    children: [
      { id: "12-1", name: "BÓNG ĐỘNG LỰC", path: "/bong-dong-luc" },
      { id: "12-2", name: "GIÀY GERU START", path: "/giay-geru-start" },
      { id: "12-3", name: "BÓNG PRO STAR", path: "/bong-pro-star" },
      { id: "12-4", name: "QUẢ BÓNG KHÁC", path: "/qua-bong-khac" },
    ],
  },
  {
    id: "13",
    name: "PHỤ KIỆN THỂ THAO",
    path: "/phu-kien-the-thao",
    children: [
      { id: "13-1", name: "TẤT (VỚ)", path: "/tat-vo" },
      {
        id: "13-2",
        name: "BÌNH XỊT CHẤN THƯƠNG LIGPRO",
        path: "/binh-xit-chan-thuong-ligpro",
      },
      {
        id: "13-3",
        name: "CAO SU NGÓN QUẤN CƠ - BĂNG KEO",
        path: "/cao-su-ngon-quan-co-bang-keo",
      },
      { id: "13-4", name: "GIỎ ĐỰNG GIÀY", path: "/gio-dung-giay" },
      { id: "13-5", name: "GĂNG THỦ MÔN - RTE", path: "/gang-thu-mon-rte" },
      { id: "13-6", name: "PHỤ KIỆN PJ-IWWIN", path: "/phu-kien-pj-iwwin" },
      {
        id: "13-7",
        name: "LÓT GIÀY - BĂNG ĐỘI TRƯỞNG - GĂNG CHỐNG NẮNG",
        path: "/lot-giay-bang-doi-truong-gang-chong-nang",
      },
      { id: "13-8", name: "PHỤ KIỆN KHÁC", path: "/phu-kien-khac" },
    ],
  },
  {
    id: "14",
    name: "CUP, CỜ, HUY CHƯƠNG, KỶ NIỆM CHƯƠNG",
    path: "/cup-co-huy-chuong-ky-niem-chuong",
    children: [
      { id: "14-1", name: "HUY CHƯƠNG", path: "/huy-chuong" },
      { id: "14-2", name: "CUP", path: "/cup" },
      { id: "14-3", name: "PHÔI CỜ", path: "/phoi-co" },
    ],
  },
  {
    id: "15",
    name: "KHUYẾN MÃI, GIẢM GIÁ, XẢ HÀNG",
    path: "/khuyen-mai-giam-gia-xa-hang",
    children: [
      { id: "15-1", name: "HÀNG ĐANG GIẢM GIÁ", path: "/hang-dang-giam-gia" },
      { id: "15-2", name: "HÀNG ĐANG XẢ GIÁ SHOCK", path: "/hang-dang-xa-gia-shock" },
    ],
  },
];

const CategorySidebar: React.FC = () => {
  // false: chưa mở rộng => chỉ hiển thị 13 mục, true: hiển thị toàn bộ
  const [expanded, setExpanded] = useState(false);

  // Nếu chưa mở rộng, chỉ hiển thị 13 mục (ẩn 2 cái cuối)
  const displayedCategories = expanded ? categories : categories.slice(0, 13);

  return (
    <div className="w-full bg-white rounded-sm border">
      <div>
        <div className="flex flex-col">
          {displayedCategories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
          <div
            className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between border-t"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="font-bold">
              {expanded ? "Ẩn bớt" : "Xem thêm"}
            </span>
            <span className="mt-1">
              {expanded ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
