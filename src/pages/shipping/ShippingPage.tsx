import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  PackageCheck,
  Truck,
  ShoppingBag,
  Home,
  Check,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion"; // Cần cài thêm framer-motion

// Các trạng thái vận chuyển
const SHIPPING_STATES = {
  PREPARING: "PREPARING",
  PICKED_UP: "PICKED_UP",
  SHIPPING: "SHIPPING",
  DELIVERING: "DELIVERING",
  DELIVERED: "DELIVERED",
};

const ShippingStatus = ({
  orderNumber = "OD78291042",
  orderDate = "10/04/2025",
  estimatedDelivery = "13/04/2025",
  currentStatus = SHIPPING_STATES.SHIPPING,
  address = "123 đường Nguyễn Văn A, Phường B, Quận C, TP. Hồ Chí Minh",
  items = [
    { id: 1, name: "Áo thun nam", price: "250.000đ", quantity: 2 },
    { id: 2, name: "Quần jeans nữ", price: "450.000đ", quantity: 1 },
  ],
}) => {
  // Xác định tiến độ hiện tại
  const getProgressPercentage = () => {
    const states = Object.values(SHIPPING_STATES);
    const currentIndex = states.indexOf(currentStatus);
    return (currentIndex / (states.length - 1)) * 100;
  };

  // Kiểm tra xem trạng thái có hoàn thành không
  const isStateCompleted = (state) => {
    const states = Object.values(SHIPPING_STATES);
    const stateIndex = states.indexOf(state);
    const currentIndex = states.indexOf(currentStatus);
    return stateIndex <= currentIndex;
  };

  // Lấy màu sắc dựa trên trạng thái
  const getStateColor = (state) => {
    if (isStateCompleted(state)) return "text-green-600";
    return "text-gray-400";
  };

  // Lấy message và icon dựa trên trạng thái
  const getStateInfo = (state) => {
    switch (state) {
      case SHIPPING_STATES.PREPARING:
        return {
          message: "Người bán đang chuẩn bị hàng",
          icon: <ShoppingBag className={`w-6 h-6 ${getStateColor(state)}`} />,
          time: "10/04/2025 09:30",
          description:
            "Người bán đã xác nhận đơn hàng và đang chuẩn bị gói hàng",
        };
      case SHIPPING_STATES.PICKED_UP:
        return {
          message: "Shipper đã lấy hàng",
          icon: <PackageCheck className={`w-6 h-6 ${getStateColor(state)}`} />,
          time: "10/04/2025 14:45",
          description: "Đơn hàng đã được giao cho đơn vị vận chuyển",
        };
      case SHIPPING_STATES.SHIPPING:
        return {
          message: "Đang trên đường vận chuyển",
          icon: <Truck className={`w-6 h-6 ${getStateColor(state)}`} />,
          time: "11/04/2025 08:15",
          description:
            "Đơn hàng đang được vận chuyển đến kho phân phối gần bạn",
        };
      case SHIPPING_STATES.DELIVERING:
        return {
          message: "Đang giao đến bạn",
          icon: <Package className={`w-6 h-6 ${getStateColor(state)}`} />,
          time: "13/04/2025 10:20",
          description: "Shipper đang trên đường giao hàng đến địa chỉ của bạn",
        };
      case SHIPPING_STATES.DELIVERED:
        return {
          message: "Đơn hàng đã được giao thành công",
          icon: <Check className={`w-6 h-6 ${getStateColor(state)}`} />,
          time: "13/04/2025 14:30",
          description:
            "Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm!",
        };
      default:
        return {
          message: "Không xác định",
          icon: null,
          time: "",
          description: "",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-4 max-w-4xl"
      >
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-t-lg p-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6" />
                Theo dõi đơn hàng của bạn
              </CardTitle>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="outline"
                  className="text-white border-white px-4 py-1.5 text-sm font-medium"
                >
                  {currentStatus === SHIPPING_STATES.DELIVERED
                    ? "✓ Đã giao hàng"
                    : "🚚 Đang giao hàng"}
                </Badge>
              </motion.div>
            </div>
            <div className="text-sm opacity-90 flex items-center gap-4 mt-4">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                Mã đơn: {orderNumber}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {orderDate}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Progress bar với animation */}
            <div className="mb-8">
              <motion.div
                className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </motion.div>

              {/* Timeline với animation */}
              <div className="grid grid-cols-1 gap-6">
                {Object.values(SHIPPING_STATES).map((state, index) => {
                  const { message, icon, time, description } =
                    getStateInfo(state);
                  return (
                    <motion.div
                      key={state}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        className={`p-3 rounded-full ${
                          isStateCompleted(state)
                            ? "bg-gradient-to-r from-orange-100 to-pink-100"
                            : "bg-gray-100"
                        } flex-shrink-0`}
                      >
                        {icon}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h3
                            className={`font-medium ${
                              isStateCompleted(state)
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {message}
                          </h3>
                          <span
                            className={`text-sm ${
                              isStateCompleted(state)
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            {isStateCompleted(state) ? time : ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {isStateCompleted(state) ? description : ""}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Products section với hover effects */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                Sản phẩm đã đặt
              </h3>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center">
                        <Package className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">{item.price}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ShippingStatus;
