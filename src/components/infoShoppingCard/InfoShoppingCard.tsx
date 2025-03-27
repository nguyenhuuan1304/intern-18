import React from 'react'

interface Order {
  id: string;
  total: number;
  date: string;
  status: string;
}

const orders: Order[] = [
  { id: "DH001", total: 1200000, date: "2024-03-17", status: "Đang xử lý" },
  { id: "DH002", total: 350000, date: "2024-03-15", status: "Hoàn thành" },
  { id: "DH003", total: 750000, date: "2024-03-14", status: "Đang giao" },
];
const InfoShoppingCard = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-hidden border ">
        <thead className="bg-gray-100 border-hidden">
          <tr>
            <th className="border  px-4 py-2 text-left font-semibold">Mã đơn hàng</th>
            <th className="border  px-4 py-2 text-left font-semibold">Tổng tiền</th>
            <th className="border  px-4 py-2 text-left font-semibold">Ngày mua</th>
            <th className="border  px-4 py-2 text-left font-semibold">Trạng thái</th>
            <th className="border  px-4 py-2 text-left font-semibold">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="border  px-4 py-2">{order.id}</td>
                <td className="border  px-4 py-2">{order.total.toLocaleString()} VND</td>
                <td className="border  px-4 py-2">{order.date}</td>
                <td className="border  px-4 py-2">{order.status}</td>
                <td className="border  px-4 py-2 text-blue-600 cursor-pointer hover:underline">
                  Xem chi tiết
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border  px-4 py-2 text-center text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default InfoShoppingCard