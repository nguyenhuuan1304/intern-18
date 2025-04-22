import React, { useEffect, useState } from "react";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchOrdersByEmail } from "@/store/order.slice";
import { useNavigate } from "react-router";

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
  const dispatch = useAppDispatch();
  const naviage = useNavigate();
  const { orders } = useAppSelector((state) => state.order);
  const email = user?.email || "";

  useEffect(() => {
    if (email) {
      dispatch(fetchOrdersByEmail(email));
    }
  }, [email, dispatch]);

  return (
    <div className="sm:overflow-auto h-full sm:h-60 relative">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 text-left font-semibold whitespace-nowrap">
              Mã đơn hàng
            </th>
            <th className="px-4 py-2 text-left font-semibold whitespace-nowrap">
              Tổng tiền
            </th>
            <th className="px-4 py-2 text-left font-semibold whitespace-nowrap hidden sm:table-cell">
              Ngày mua
            </th>
            <th className="px-4 py-2 text-left font-semibold whitespace-nowrap hidden md:table-cell">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition cursor-pointer"
                onClick={() =>
                  naviage(`/order/${order.orderId}`, {
                    state: { order },
                  })
                }
              >
                <td className="px-4 py-2 whitespace-nowrap">{order.orderId}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {order.total_price.toLocaleString()} VND
                </td>
                <td className="px-4 py-2 whitespace-nowrap hidden sm:table-cell">
                  {moment(order.createdAt).format("HH:mm:ss, DD/MM/YYYY")}
                </td>
                <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">
                  {order.status_order}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InfoShoppingCard;
