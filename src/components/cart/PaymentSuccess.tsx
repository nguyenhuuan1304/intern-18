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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { removeCartItem } from "@/store/cartSlice";
import {
  fetchOrderByOrderId,
  fetchOrderDetail,
  sendEmailOrder,
  updateOrderStatus,
} from "@/store/order.slice";
import { useAppDispatch } from "@/hooks/useRedux";
import axios from "axios";
 
export const PaymentSuccess: React.FC = () => {
  const dispatch = useAppDispatch();
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
 
  useEffect(() => {
    const orderId = new URLSearchParams(location.search).get("order_id");
    if (!orderId) return;
 
    const handleOrderUpdate = async () => {
      try {
        const actionResult = await dispatch(fetchOrderByOrderId(orderId));
        const fetchedOrders = actionResult.payload;
 
        if (!fetchedOrders || fetchedOrders.length === 0) {
          console.error("❌ Không tìm thấy đơn hàng với orderId:", orderId);
          return;
        }
        const orderToUpdate = fetchedOrders[0];
        setOrderData(orderToUpdate);
        const order_status = "Đã thanh toán";
        await dispatch(
          updateOrderStatus({
            documentId: orderToUpdate.documentId,
            status_order: order_status,
          })
        );
        console.log("✅ Cập nhật trạng thái đơn hàng thành công");
      } catch (error) {
        console.error("❌ Lỗi khi cập nhật trạng thái đơn hàng:", error);
      }
    };
 
    handleOrderUpdate();
  }, [location.search, dispatch]);
 
  useEffect(() => {
    const clearCartOnServer = async () => {
      try {
        await Promise.all(
          cartItems.map((item) => dispatch(removeCartItem(item.documentId)))
        );
      } catch (error) {
        console.error("❌ Lỗi khi xóa giỏ hàng trên server:", error);
      }
    };
 
    clearCartOnServer();
  }, [cartItems]);
 
  useEffect(() => {
    const sendEmailOrderAsync = async () => {
      try {
        if (!orderData) return;
 
        const orderItems = await dispatch(
          fetchOrderDetail(orderData.orderId)
        ).unwrap();
 
        await dispatch(
          sendEmailOrder({
            orderId: orderData.orderId,
            type: "success",
            orderItems: orderItems,
          })
        ).unwrap();
      } catch (error) {
        console.log("Lỗi khi gửi email :", error);
      }
    };
 
    if (orderData) {
      sendEmailOrderAsync();
    }
  }, [orderData]);
 
  useEffect(() => {
    const orderId = new URLSearchParams(location.search).get("order_id");
    if (!orderId) return;
 
    const createShipping = async () => {
      try {
        const payload = {
          data: {
            order: orderId,
            shipping_status: "PREPARING",
            shipping_date: new Date().toISOString(),
          },
        };
 
        const response = await axios.post(
          "http://localhost:1337/api/shippings",
          payload
        );
        console.log("✅ Tạo vận chuyển thành công:", response);
      } catch (error) {
        console.error("❌ Lỗi khi tạo vận chuyển:", error);
      }
    };
 
    createShipping();
  }, [location.search]);
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
                <strong>Trạng thái:</strong> Đã thanh toán
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
                {orderData.total_price.toLocaleString()} VND
              </p>
            </div>
          )}
        </CardContent>
 
        <CardFooter>
          <Button
            variant="ghost"
            onClick={() => navigate("/account")}
            className="w-full cursor-pointer"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};