import axios from "axios";
import React, { useEffect, useState } from "react";
import { User } from "../header/Header";
import moment from "moment";
interface Order {
  id: string;
  total_price: number;
  createdAt: string;
  status_order: string;
}

const InfoShoppingCard = () => {
  const user: User = JSON.parse(localStorage.getItem("user") || "null");
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    fetchAllOrderByEmail(user.email);
  }, []);
  const fetchAllOrderByEmail = async (email) => {
    const res = await axios.get(
      `http://localhost:1337/api/orders?filters[email][$eq]=${email}`
    );
    setOrders(res.data.data);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-hidden border ">
        <thead className="bg-gray-100 border-hidden">
          <tr>
            <th className="border  px-4 py-2 text-left font-semibold">
              Mã đơn hàng
            </th>
            <th className="border  px-4 py-2 text-left font-semibold">
              Tổng tiền
            </th>
            <th className="border  px-4 py-2 text-left font-semibold">
              Ngày mua
            </th>
            <th className="border  px-4 py-2 text-left font-semibold">
              Trạng thái
            </th>
            <th className="border  px-4 py-2 text-left font-semibold">
              Chi tiết
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="border  px-4 py-2">{order.id}</td>
                <td className="border  px-4 py-2">
                  {order.total_price.toLocaleString()} VND
                </td>
                <td className="border  px-4 py-2">
                  {moment(order?.createdAt).format("HH:mm:ss, DD/MM/YYYY")}
                </td>
                <td className="border  px-4 py-2">{order.status_order}</td>
                <td className="border  px-4 py-2 text-blue-600 cursor-pointer hover:underline">
                  Xem chi tiết
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="border  px-4 py-2 text-center text-gray-500"
              >
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
