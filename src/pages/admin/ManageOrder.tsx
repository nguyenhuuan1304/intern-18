import { JSX, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UpdateStatusShipping } from "./UpdateStatusShipping";
import { toast } from "react-toastify";
import moment from "moment";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchOrders } from "@/store/order.slice";
import { updateShippingStatus } from "@/store/shipping.slice";

interface StatusOption {
  id: string;
  label: string;
}
const ManagerOrder = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const statuses: StatusOption[] = [
    {
      id: "PREPARING",
      label: "Đang chuẩn bị",
    },
    {
      id: "PICKED_UP",
      label: "Đã lấy hàng",
    },
    {
      id: "SHIPPING",
      label: "Đang vận chuyển",
    },
    {
      id: "DELIVERING",
      label: "Đang giao hàng",
    },
    {
      id: "DELIVERED",
      label: "Đã giao hàng",
    },
  ];

  const { orders, shippingStatusByOrder, loading } = useAppSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await dispatch(updateShippingStatus({ orderId, newStatus })).unwrap();
      dispatch(fetchOrders());
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (err) {
      toast.error(`Cập nhật thất bại: ${err}`);
    }
  };

  const getShippingStatusStyle = (status: string) => {
    switch (status) {
      case "PREPARING":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          label: "Đang chuẩn bị",
        };
      case "PICKED_UP":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          label: "Đã lấy hàng",
        };
      case "SHIPPING":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          label: "Đang vận chuyển",
        };
      case "DELIVERING":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          label: "Đang giao hàng",
        };
      case "DELIVERED":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          label: "Đã giao hàng",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          label: "Không xác định",
        };
    }
  };

  // Fixed filtering logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      shippingStatusByOrder[order.orderId] === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Quản lý đơn hàng
        </h1>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-visible">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex space-x-4 mb-4 md:mb-0">
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-6 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Tất cả</option>
                    {statuses.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex-1 p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="py-4 font-semibold text-gray-900">
                        Mã đơn
                      </TableHead>
                      <TableHead className="py-4 font-semibold text-gray-900">
                        Email
                      </TableHead>
                      <TableHead className="py-4 font-semibold text-gray-900">
                        Ngày đặt đơn
                      </TableHead>
                      <TableHead className="py-4 font-semibold text-gray-900">
                        Tổng tiền
                      </TableHead>
                      <TableHead className="py-4 font-semibold text-gray-900">
                        Trạng thái thanh toán
                      </TableHead>
                      <TableHead className="py-4 font-semibold text-gray-900">
                        Trạng thái giao hàng
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-[340px] text-center text-gray-500"
                        >
                          <div className="py-16 flex flex-col items-center justify-center">
                            <svg
                              className="w-16 h-16 text-gray-300 mb-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                            <p className="text-lg font-medium">
                              Không có đơn hàng nào
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Đơn hàng mới sẽ xuất hiện ở đây
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentOrders.map((order) => {
                        const currentStatus =
                          shippingStatusByOrder[order.orderId] || "PREPARING";
                        const statusStyle =
                          getShippingStatusStyle(currentStatus);

                        return (
                          <TableRow
                            key={order.id}
                            className="align-top hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <TableCell className="py-4 font-medium">
                              #{order.orderId}
                            </TableCell>
                            <TableCell className="py-4 text-gray-600">
                              {order.email}
                            </TableCell>
                            <TableCell className="py-4 text-gray-600">
                              {moment(order.createdAt).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </TableCell>
                            <TableCell className="py-4 font-medium text-gray-900">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(order.total_price)}
                            </TableCell>
                            <TableCell className="py-4">
                              {order.status_order === "Đã thanh toán" ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                                  Đã thanh toán
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200">
                                  Chờ xử lý
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="py-4 relative">
                              <div className="relative inline-block">
                                <div
                                  onClick={() =>
                                    setShowStatusMenu(order.orderId)
                                  }
                                  className="cursor-pointer inline-block"
                                >
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}
                                  >
                                    {statusStyle.label}
                                  </span>
                                </div>
                              </div>

                              <UpdateStatusShipping
                                order={order}
                                showStatusMenu={
                                  showStatusMenu === order.orderId
                                }
                                statuses={statuses}
                                currentStatus={currentStatus}
                                onStatusClick={setShowStatusMenu}
                                onStatusUpdate={handleStatusUpdate}
                                onClose={() => setShowStatusMenu(null)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>

                {/* Đảm bảo bảng có chiều cao tối thiểu ngay cả khi chỉ có một hàng */}
                {currentOrders.length > 0 && currentOrders.length < 3 && (
                  <div className="h-[calc(340px-(68px*3))]"></div>
                )}
              </div>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={`${
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    } cursor-pointer`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={`${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    } cursor-pointer`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerOrder;
