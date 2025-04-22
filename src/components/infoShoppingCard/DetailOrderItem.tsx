import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchOrderDetail } from "@/store/order.slice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Truck, Receipt } from "lucide-react";
import Header from "../header/Header";
import ShippingStatus from "../../pages/shipping/ShippingPage";

interface OrderDetailItem {
  id: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  size: string;
  [key: string]: any;
}

const DetailOrderItem: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const passedOrder = location.state?.order;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orderDetail, loading, error } = useAppSelector(
    (state) => state.order
  );
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetail(orderId));
    }
  }, [orderId, dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Đang tải...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Lỗi: {error}
      </div>
    );
  if (!orderDetail)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Đơn hàng không tồn tại
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Header />
        <div className="flex items-center max-w-7xl mx-auto p-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-lg lg:text-2xl font-bold text-gray-800">
            Đơn hàng #{passedOrder?.orderId}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 mt-4">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Chi tiết đơn hàng
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Theo dõi vận chuyển
            </TabsTrigger>
          </TabsList>

          {/* Order Details Tab */}
          <TabsContent value="details" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Summary */}
              <Card className="lg:col-span-2 shadow-md border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Package className="w-5 h-5 text-orange-500" />
                      Thông tin đơn hàng
                    </h2>
                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                      {passedOrder?.status_order}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Mã đơn hàng</p>
                      <p className="font-medium">{passedOrder?.orderId}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                      <p className="font-medium">
                        {moment(passedOrder?.createdAt).format(
                          "HH:mm, DD/MM/YYYY"
                        )}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Phương thức thanh toán
                      </p>
                      <p className="font-medium">Thanh toán bằng thẻ</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="font-medium text-lg text-orange-600">
                        {passedOrder?.total_price?.toLocaleString()}đ
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Danh sách sản phẩm</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {orderDetail?.map((item: OrderDetailItem) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
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
                          <p className="font-medium">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card className="shadow-md border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 pb-4 border-b flex items-center gap-2">
                    <Truck className="w-5 h-5 text-orange-500" />
                    Thông tin giao hàng
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Người nhận</p>
                      <p className="font-medium">
                        {user?.username || "Khách hàng"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Số điện thoại
                      </p>
                      <p className="font-medium">{passedOrder?.phone_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-medium">{passedOrder?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Địa chỉ giao hàng
                      </p>
                      <p className="font-medium">
                        {passedOrder?.address_shipping}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                      <p className="font-medium italic">
                        {passedOrder?.note || "Không có ghi chú"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="mt-0">
            <ShippingStatus order={passedOrder} orderDetail={orderDetail} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DetailOrderItem;
