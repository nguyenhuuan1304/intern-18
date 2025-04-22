import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  PackageCheck,
  Truck,
  ShoppingBag,
  Check,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchShippingByOrder } from "@/store/shipping.slice";

const SHIPPING_STATES = {
  PREPARING: "PREPARING",
  PICKED_UP: "PICKED_UP",
  SHIPPING: "SHIPPING",
  DELIVERING: "DELIVERING",
  DELIVERED: "DELIVERED",
};

const ShippingStatus = ({ order, orderDetail }) => {
  const dispatch = useAppDispatch();
  const { shippings, currentStatus } = useAppSelector(
    (state) => state.shipping
  );
  useEffect(() => {
    if (order.orderId) {
      dispatch(fetchShippingByOrder(order.orderId));
    }
  }, [order, dispatch]);
  const getProgressPercentage = () => {
    const states = Object.values(SHIPPING_STATES);
    const currentIndex = states.indexOf(currentStatus);
    return (currentIndex / (states.length - 1)) * 100;
  };

  const isStateCompleted = (state: string) => {
    const states = Object.values(SHIPPING_STATES);
    const stateIndex = states.indexOf(state);
    const currentIndex = states.indexOf(currentStatus);
    return stateIndex <= currentIndex;
  };

  const getStateColor = (state: string) => {
    return isStateCompleted(state) ? "text-blue-600" : "text-gray-400";
  };

  const getShippingDateByState = (state: string) => {
    const shipping = shippings.find((item) => item.shipping_status === state);
    if (shipping) {
      return moment(shipping.shipping_date).format("DD/MM/YYYY HH:mm");
    }
    return ""; // hoặc "Chưa cập nhật"
  };
  const getStateInfo = (state: string) => {
    switch (state) {
      case SHIPPING_STATES.PREPARING:
        return {
          message: "Người bán đang chuẩn bị hàng",
          icon: <ShoppingBag className={`w-6 h-6 ${getStateColor(state)}`} />,
          time: getShippingDateByState(state),
          description:
            "Người bán đã xác nhận đơn hàng và đang chuẩn bị gói hàng",
        };
      case SHIPPING_STATES.PICKED_UP:
        return {
          message: "Shipper đã lấy hàng",
          icon: <PackageCheck className={`w-6 h-6 ${getStateColor(state)}`} />,
          time: getShippingDateByState(state),
          description: "Đơn hàng đã được giao cho đơn vị vận chuyển",
        };
      case SHIPPING_STATES.SHIPPING:
        return {
          message: "Đang trên đường vận chuyển",
          icon: <Truck className={`w-6 h-6 ${getStateColor(state)}`} />,
          time: getShippingDateByState(state),
          description:
            "Đơn hàng đang được vận chuyển đến kho phân phối gần bạn",
        };
      case SHIPPING_STATES.DELIVERING:
        return {
          message: "Đang giao đến bạn",
          icon: <Package className={`w-6 h-6 ${getStateColor(state)}`} />,
          time: getShippingDateByState(state),
          description: "Shipper đang trên đường giao hàng đến địa chỉ của bạn",
        };
      case SHIPPING_STATES.DELIVERED:
        return {
          message: "Đơn hàng đã được giao thành công",
          icon: <Check className={`w-6 h-6 ${getStateColor(state)}`} />,
          time: getShippingDateByState(state),
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
    <div className="min-h-screen bg-white  ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container h-full mt-0"
      >
        <Card className="shadow-2xl border-0 overflow-hidden h-full">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg p-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg md:text-xl lg:text-2xl font-bold flex items-center gap-2">
                <Package className="w-5 h-5 md:w-6 md:h-6" />
                Theo dõi đơn hàng của bạn
              </CardTitle>
            </div>

            <div className="text-sm opacity-90 flex items-center gap-4 mt-4">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                Mã đơn: {order.orderId}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {moment(order?.createdAt).format("DD/MM/YYYY")}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-8">
              <motion.div
                className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </motion.div>

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
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        className={`p-3 rounded-full ${
                          isStateCompleted(state)
                            ? "bg-gradient-to-r from-blue-100 to-indigo-100"
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
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          >
                            {message}
                          </h3>
                          <span
                            className={`text-sm ${
                              isStateCompleted(state)
                                ? "text-blue-600"
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

            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
                Sản phẩm đã đặt
              </h3>
              <div className="space-y-4">
                {orderDetail.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            Số lượng: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="font-medium">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </span>
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
