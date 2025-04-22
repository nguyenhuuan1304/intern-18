import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchOrderDetail } from "@/store/order.slice";

export interface OrderDetailItem {
  id: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  [key: string]: any;
}

interface OrderSelected {
  documentId: string;
  orderId: string;
  email: string;
  createdAt: string;
  phone_number: string;
  address_shipping: string;
  note?: string;
  total_price: number;
  [key: string]: any;
}

interface DetailOrderItemProps {
  open: boolean;
  handleClose: (open: boolean) => void;
  orderSelected: OrderSelected;
}

const DetailOrderItem: React.FC<DetailOrderItemProps> = ({
  open,
  handleClose,
  orderSelected,
}) => {
  const dispatch = useAppDispatch();
  const { orderDetail } = useAppSelector((state) => state.order);
  useEffect(() => {
    if (orderSelected.orderId) {
      dispatch(fetchOrderDetail(orderSelected.orderId));
    }
  }, [orderSelected.orderId, dispatch]);
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-xl p-6 shadow-xl ring-1 ring-gray-200">
        {/* Header */}
        <DialogHeader className="flex justify-between items-center border-b pb-2 mb-4">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Chi tiết đơn hàng
          </DialogTitle>
        </DialogHeader>

        {/* Nội dung */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <p className="text-gray-700">
              <span className="font-semibold">Mã đơn hàng:</span>{" "}
              {orderSelected.orderId}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span>{" "}
              {orderSelected.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Ngày đặt hàng:</span>{" "}
              {moment(orderSelected.createdAt).format("HH:mm:ss, DD/MM/YYYY")}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {orderSelected.phone_number}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Địa chỉ:</span>{" "}
              {orderSelected.address_shipping}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Ghi chú:</span>{" "}
              {orderSelected.note || "Không có"}
            </p>
          </div>

          <div className="overflow-y-auto h-52 px-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Sản phẩm
            </h3>
            <ul className="divide-y divide-gray-200">
              {orderDetail?.map((item) => (
                <li
                  key={item.id}
                  className="py-2 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span className="text-gray-700">
                      {item.name}{" "}
                      <span className="text-sm text-gray-500">
                        (x{item.quantity})
                      </span>
                    </span>
                  </div>
                  <span className="text-gray-800 font-medium">
                    {item.price.toLocaleString()}đ
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t pt-3 flex justify-end">
          <p className="text-xl font-bold text-gray-800">
            Tổng: {orderSelected?.total_price?.toLocaleString()}đ
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailOrderItem;
