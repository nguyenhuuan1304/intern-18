import { useEffect, useState, useRef } from "react";

import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const UpdateStatusShipping = ({
  order,
  showStatusMenu,
  statuses,
  currentStatus,
  onStatusClick,
  onStatusUpdate,
  onClose,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Xử lý vị trí menu tùy thuộc vào viewport
    if (showStatusMenu && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Kiểm tra nếu menu sẽ bị tràn ra ngoài màn hình
      const isOverflowRight = rect.right > viewportWidth;
      const isOverflowBottom = rect.bottom > viewportHeight;

      setMenuPosition({
        top: isOverflowBottom ? -rect.height : 10,
        left: isOverflowRight ? -(rect.width - 40) : 0,
      });
    }
  }, [showStatusMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleResize = () => {
      // Đóng menu khi resize để tránh lỗi vị trí
      if (showStatusMenu) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose, showStatusMenu]);

  const handleStatusSelect = (status) => {
    if (currentStatus === status.id) {
      return;
    }
    setSelectedStatus(status);
    setShowConfirmModal(true);
    onStatusClick(null);
  };

  const handleConfirmStatusUpdate = async () => {
    await onStatusUpdate(order.orderId, selectedStatus.id);
    setShowConfirmModal(false);
  };

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case "PREPARING":
        return "bg-blue-500";
      case "PICKED_UP":
        return "bg-purple-500";
      case "SHIPPING":
        return "bg-amber-500";
      case "DELIVERING":
        return "bg-orange-500";
      case "DELIVERED":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <div
        className="absolute z-[1000]"
        style={{
          position: "absolute",
          top: menuPosition.top,
          left: menuPosition.left,
          zIndex: 1000,
        }}
        ref={menuRef}
      >
        <AnimatePresence>
          {showStatusMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, type: "spring", stiffness: 300 }}
              className="rounded-xl bg-white shadow-lg border border-gray-200 ring-1 ring-gray-200 ring-opacity-50 backdrop-blur-sm"
              style={{
                width: "240px", // Fixed width for consistency
                maxWidth: "calc(100vw - 40px)", // Prevent overflow on small screens
              }}
            >
              <div className="p-2">
                {statuses.map((status) => (
                  <motion.button
                    key={status.id}
                    onClick={() => handleStatusSelect(status)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full flex items-center space-x-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-left text-xs sm:text-sm transition-all duration-200 hover:bg-gray-50"
                  >
                    <span
                      className={`flex-shrink-0 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ${getStatusColor(
                        status.id
                      )}`}
                    />

                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {status.label}
                      </span>
                    </div>

                    {currentStatus === status.id && (
                      <span className="absolute right-3 sm:right-4">
                        <Check size={14} className="text-green-500" />
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md max-w-[95vw] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Xác nhận thay đổi trạng thái
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
              Bạn có chắc chắn muốn thay đổi trạng thái của đơn hàng{" "}
              <span className="font-medium text-gray-900">
                #{order?.orderId?.substring(0, 6)}...
              </span>{" "}
              thành{" "}
              <span
                className={`font-medium ${
                  selectedStatus?.id === "PREPARING"
                    ? "text-blue-600"
                    : selectedStatus?.id === "PICKED_UP"
                    ? "text-purple-600"
                    : selectedStatus?.id === "SHIPPING"
                    ? "text-amber-600"
                    : selectedStatus?.id === "DELIVERING"
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {selectedStatus?.label}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-2 sm:space-x-3 mt-4 sm:mt-6">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <X size={14} className="mr-1 sm:mr-2" />
              Hủy
            </button>
            <button
              onClick={handleConfirmStatusUpdate}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <Check size={14} className="mr-1 sm:mr-2" />
              Xác nhận
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
