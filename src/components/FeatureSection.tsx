import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import award1 from "@/assets/award-1.webp";
import award2 from "@/assets/award-2.webp";
import award3 from "@/assets/award-3.webp";
import award4 from "@/assets/award-4.webp";

interface FeatureItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    id: 1,
    icon: award1,
    title: "CHIẾT KHẤU ƯU ĐÃI",
    description:
      "Lấy hàng sỉ tại kawin.vn bạn sẽ được ưu đãi cùng mức chiết khấu hấp dẫn",
  },
  {
    id: 2,
    icon: award2,
    title: "GIÁ CẢ CẠNH TRANH",
    description:
      "Giá sỉ tốt nhất đối với các mặt hàng thể thao dành cho kinh doanh",
  },
  {
    id: 3,
    icon: award3,
    title: "HÀNG HÓA ĐA DẠNG, SẴN KHO",
    description: "Đa dạng sản phẩm và sẵn kho để bạn đặt hàng trên toàn quốc",
  },
  {
    id: 4,
    icon: award4,
    title: "GIAO HÀNG NHANH CHÓNG",
    description:
      "Đơn hàng sẽ được xử lý ngay sau khi khách đặt, giao nhanh toàn quốc",
  },
];

const FeatureSection: React.FC = () => {
  return (
    <section className="py-8 px-4 text-center">
      <h2
        className="text-xl md:text-2xl font-bold text-red-600 mb-4 italic"
        style={{ fontFamily: "'Hemi Head', sans-serif" }}
      >
        Quần áo thể thao KAWIN
      </h2>
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Chào mừng quý khách đã đến trang đặt hàng
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className="bg-[#feecec] shadow-md hover:shadow-xl transition-shadow"
          >
            <CardHeader className="flex flex-col items-center space-y-3">
              {/* Hiển thị icon dưới dạng ảnh */}
              <div className="flex items-center space-x-4">
                {/* Container ảnh cố định */}
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 bg-[#eb4138] rounded-full">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                {/* Tiêu đề sản phẩm, chiếm không gian còn lại */}
                <CardTitle className="text-base font-semibold text-left flex-1">
                  {feature.title}
                </CardTitle>
              </div>

              {/* Tiêu đề */}

              {/* Mô tả */}
              <CardDescription className="text-sm text-gray-600">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
