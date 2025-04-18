import React, { useEffect, useState } from "react";
import { Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { removeCartItem } from "@/store/cartSlice";
import axios from "axios";
import { fetchOrderDetail } from "@/store/order.slice";

export const PaymentSuccess: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  interface OrderData {
    orderId: string;
    email: string;
    status_order: string;
    address_shipping: string;
    phone_number: string;
    note?: string;
    total_price: number;
    emailSent?: boolean;
    }

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  useEffect(() => {
    // Lấy order_id từ query string
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");
    const updateOrderStatus = async () => {
      if (!orderId) return;
      try {
        const res = await axios.get(
          `http://localhost:1337/api/orders?filters[orderId][$eq]=${orderId}`
        );
        const matchingOrders = res.data.data;
        if (matchingOrders.length === 0) {
          console.error("❌ Không tìm thấy đơn hàng với orderId:", orderId);
          return;
        }
        const orderToUpdate = matchingOrders[0];
        setOrderData(orderToUpdate);
        const realId = orderToUpdate.documentId;
        await axios.put(`http://localhost:1337/api/orders/${realId}`, {
          data: {
            status_order: "Đã thanh toán",
          },
        });
        console.log("✅ Cập nhật trạng thái đơn hàng thành công");
      } catch (error) {
        console.error("❌ Lỗi khi cập nhật trạng thái đơn hàng:", error);
      }
    };
    updateOrderStatus();
    const clearCartOnServer = async () => {
      try {
        await Promise.all(
          cartItems.map((item) => dispatch(removeCartItem(item.documentId)))
        );
      } catch (error) {
        console.error("Error clearing cart on server:", error);
      }
    };
    clearCartOnServer();
    }, [location.search]);
    useEffect(() => {
        const sendEmailOrder = async () => {
        try {
        if (!orderData) return;
        // Gọi dispatch để fetch orderItems nếu chưa có
        const orderItems = await dispatch(
        fetchOrderDetail(orderData.orderId)
        ).unwrap();
        console.log("order_items", orderItems);
        const res = await axios.post(
        `http://localhost:1337/api/order/sendEmailOrder`,
        {
        order_id: orderData.orderId,
        type: "success",
        order_items: orderItems,
        }
        );
        setEmailSent(true);
        } catch (error) {
        console.log("Lỗi khi gửi email :", error);
        }
    };
    if (orderData && !emailSent) {
    sendEmailOrder();
    }
    }, [orderData]);

  return (
    <div className="flex min-h-[500px] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-lg">
        <div className="bg-green-500 py-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Thanh toán thành công!
          </CardTitle>
          <CardDescription>Cảm ơn bạn đã đặt hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Biên lai thanh toán đã được gửi đến email của bạn
            </p>
          </div>
          {orderData && (
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Mã đơn hàng:</strong> {orderData.orderId}
              </p>
              <p>
                <strong>Email:</strong> {orderData.email}
              </p>
              <p>
                <strong>Trạng thái:</strong> {orderData.status_order}
              </p>
              <p>
                <strong>Địa chỉ giao hàng:</strong> {orderData.address_shipping}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {orderData.phone_number}
              </p>
              {orderData.note && (
                <p>
                  <strong>Ghi chú:</strong> {orderData.note}
                </p>
              )}
              <p>
                <strong>Tổng tiền:</strong>{" "}
                 {orderData?.total_price?.toLocaleString()} VND
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            onClick={() => navigate("/account")}
            className="w-full"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};