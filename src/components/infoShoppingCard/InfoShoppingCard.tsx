import React, { useEffect, useState } from "react";
import moment from "moment";
import DetailOrderItem from "./DetailOrderItem";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchOrdersByEmail } from "@/store/order.slice";

export interface Order {
  id: string;
  orderId: string;
  total_price: number;
  createdAt: string;
  status_order: string;
  email: string;
  phone_number: string;
  address_shipping: string;
  note?: string;
}

export interface User {
  email: string;
}

const InfoShoppingCard: React.FC = () => {
  const [user] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [open, setOpen] = useState<boolean>(false);
  const [orderSelected, setOrderSelected] = useState<Order | null>(null);
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.order);
  const email = user?.email || "";

  useEffect(() => {
    if (email) {
      dispatch(fetchOrdersByEmail(email));
    }
  }, [email, dispatch]);
  const handleViewDetailOrder = (order: Order) => {
    setOrderSelected(order);
    setOpen(true);
  };

  return (
    <div className="overflow-y-auto h-60">
      <table className="min-w-full border-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left font-semibold">
              Mã đơn hàng
            </th>
            <th className="border px-4 py-2 text-left font-semibold">
              Tổng tiền
            </th>
            <th className="border px-4 py-2 text-left font-semibold">
              Ngày mua
            </th>
            <th className="border px-4 py-2 text-left font-semibold">
              Trạng thái
            </th>
            <th className="border px-4 py-2 text-left font-semibold">
              Chi tiết
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="border px-4 py-2">{order.orderId}</td>
                <td className="border px-4 py-2">
                  {order.total_price.toLocaleString()} VND
                </td>
                <td className="border px-4 py-2">
                  {moment(order.createdAt).format("HH:mm:ss, DD/MM/YYYY")}
                </td>
                <td className="border px-4 py-2">{order.status_order}</td>
                <td
                  className="border px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                  onClick={() => handleViewDetailOrder(order)}
                >
                  Xem chi tiết
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="border px-4 py-2 text-center text-gray-500"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {orderSelected && (
        <DetailOrderItem
          open={open}
          handleClose={setOpen}
          orderSelected={orderSelected}
        />
      )}
    </div>
  );
};

export default InfoShoppingCard;
