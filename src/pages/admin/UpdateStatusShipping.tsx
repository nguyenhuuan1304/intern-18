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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

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
        className="absolute z-[1000] right-3 mt-2 w-64 origin-top-right "
        style={{
          position: "fixed",
          transform: "translateY(10px)",
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
              className="absolute z-50 right-0 mt-2 w-64 rounded-xl bg-white shadow-lg border border-gray-200 ring-1 ring-gray-200 ring-opacity-50 backdrop-blur-sm"
              style={{
                transform: "translateY(0%)",
              }}
            >
              <div className="p-2">
                {statuses.map((status) => (
                  <motion.button
                    key={status.id}
                    onClick={() => handleStatusSelect(status)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-sm transition-all duration-200 hover:bg-gray-50"
                  >
                    <span
                      className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${getStatusColor(
                        status.id
                      )}`}
                    />

                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {status.label}
                      </span>
                    </div>

                    {currentStatus === status.id && (
                      <span className="absolute right-4">
                        <Check size={16} className="text-green-500" />
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Xác nhận thay đổi trạng thái
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-3">
              Bạn có chắc chắn muốn thay đổi trạng thái của đơn hàng{" "}
              <span className="font-medium text-gray-900">
                #{order?.orderId}
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

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <X size={16} className="mr-2" />
              Hủy
            </button>
            <button
              onClick={handleConfirmStatusUpdate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <Check size={16} className="mr-2" />
              Xác nhận
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
