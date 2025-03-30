import { ArrowLeft, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "@/store/cartSlice";
import { fetchInventories, updateInventory } from "@/store/inventorySlice";
import Select from "react-select";
import { getProvinces, getDistricts, getWards } from "./service/addressService";
import { selectTotalItems } from "@/store/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { PaymentSuccess } from "./PaymentSuccess";
import { PaymentFail } from "./PaymentFail";
const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: cartItems,
    error,
    loading,
  } = useSelector((state: RootState) => state.cart);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const email = user.email || "";
  const searchParams = new URLSearchParams(location.search);
  const success = searchParams.get("success");
  const cancel = searchParams.get("cancel");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [streetAddress, setStreetAddress] = useState("");
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const inventories = useSelector((state: RootState) => state.inventory.inventories);

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getDistricts(selectedProvince.value).then(setDistricts);
      setSelectedDistrict(null);
      setSelectedWard(null);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      getWards(selectedDistrict.value).then(setWards);
      setSelectedWard(null);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    if (inventories.length === 0) {
      dispatch(fetchInventories());
    }
  }, [dispatch, inventories.length]);

  const handleIncrease = (documentId: string, currentQuantity: number) => {
    dispatch(
      updateCartItemQuantity({ documentId, quantity: currentQuantity + 1 })
    );
  };

  const handleDecrease = (documentId: string, currentQuantity: number) => {
    if (currentQuantity < 1) {
      dispatch(removeCartItem(documentId));
    }
    dispatch(
      updateCartItemQuantity({ documentId, quantity: currentQuantity - 1 })
    );
  };

  const handleRemove = (documentId: string) => {
    dispatch(removeCartItem(documentId));
  };
  const cart = useSelector((state: RootState) => state.cart.items);

  const handleOrder = () => {
    if (!cart || cart.length === 0) {
      console.error("Cart is empty");
      return;
    }

    if (!inventories || inventories.length === 0) {
      console.error("Inventory data is missing");
      return;
    }

    console.log("Cart Data:", cart);
    console.log("Inventories Data:", inventories);

    const updatedQuantities = cart
      .map((cartItem) => {
        const documentId = cartItem.products?.[0]?.documentId;
        const size = cartItem.size;

        if (!documentId || !size) {
          console.warn("Cart item missing documentId or size:", cartItem);
          return null;
        }

        const inventoryItem = inventories.find(
          (inventory) =>
            inventory?.product?.documentId === documentId &&
            inventory?.size === size
        );

        if (!inventoryItem) {
          console.warn(`No inventory found for product ${documentId} - size ${size}`);
          return null;
        }

        return {
          documentId: String(inventoryItem.documentId),
          quantity: Math.max(inventoryItem.quantity - cartItem.quantity, 0),
        };
      })
      .filter((item): item is { documentId: string; quantity: number } => item !== null);

    console.log("Updated Quantities:", updatedQuantities);

    if (updatedQuantities.length === 0) {
      console.warn("No valid inventory updates to process.");
      return;
    }

    dispatch(updateInventory(updatedQuantities));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const totalItems = useSelector(selectTotalItems);
  useEffect(() => {
    localStorage.setItem("cartTotalItems", totalItems.toString());
  }, [totalItems]);
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const stripe = await loadStripe(
        "pk_test_51R66O0DftvJgslwBKdVOWz4UJ7sdpk6W9ALddQgPs3XBYQCV46xaDSgSqYpWAFZevhLYKgFyPAmp4wLm7THP3r0400LXhtMelk"
      );
      const response = await axios.post(
        "http://localhost:1337/api/orders",
        {
          orders: cart.map((item) => ({
            productId: item.documentId,
            quantity: item.quantity,
          })),
          email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      if (data.error) throw new Error(data.error);
      if (!data.stripeSession?.id)
        throw new Error("Failed to create Stripe session");

      // Chuyển hướng đến trang thanh toán của Stripe
      await stripe?.redirectToCheckout({
        sessionId: data.stripeSession.id,
      });
    } catch (err) {
      console.error("Thanh toán lỗi:", err);
    }
  };

  if (success === "true") {
    return <PaymentSuccess />;
  }
  if (cancel === "true") {
    return <PaymentFail />;
  }

  return (
    <>
      <div className="m-5 flex items-center justify-between">
        <NavLink to={"/"}>
          <img
            className="w-[120px] md:w-[150px]"
            src="https://kawin.vn/uploads/source//logo/z4795324951181-8df678a6cf3f0283a5b110357eb0c396.webp"
            alt="Logo"
          />
        </NavLink>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-all 
                           text-sm md:text-base h-10 md:h-9 w-[110px] md:w-[150px] justify-center"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Quay lại</span>
        </button>
      </div>
      <hr />

      <div className="flex flex-col md:flex-row p-4">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl text-cyan-800 font-bold mb-4">
            THÔNG TIN VẬN CHUYỂN
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700">Điện thoại</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Số điện thoại của bạn"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Điền địa chỉ email của bạn"
              value={email}
            />
          </div>

          <div className="relative">
            {/* Form nhập địa chỉ (ẩn/hiện) */}
            {isAddressFormOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h3 className="text-lg font-medium mb-4">Nhập địa chỉ</h3>

                  {/* Chọn Tỉnh */}
                  <Select
                    options={provinces}
                    value={selectedProvince}
                    onChange={setSelectedProvince}
                    placeholder="Chọn tỉnh"
                    className="mb-2"
                  />

                  {/* Chọn Huyện */}
                  <Select
                    options={districts}
                    value={selectedDistrict}
                    onChange={setSelectedDistrict}
                    placeholder="Chọn huyện"
                    isDisabled={!selectedProvince}
                    className="mb-2"
                  />

                  {/* Chọn Xã */}
                  <Select
                    options={wards}
                    value={selectedWard}
                    onChange={setSelectedWard}
                    placeholder="Chọn xã"
                    isDisabled={!selectedDistrict}
                    className="mb-2"
                  />

                  {/* Nhập số nhà, tên đường */}
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Số nhà, tên đường"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                  />

                  {/* Nút Lưu và Đóng */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setIsAddressFormOpen(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={() => setIsAddressFormOpen(false)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <label className="block text-gray-700">Địa chỉ: </label>
              <p
                onClick={() => setIsAddressFormOpen(true)}
                className="text-blue-500 cursor-pointer"
              >
                Nhập địa chỉ
              </p>
            </div>

            {/* Hiển thị thông tin đã chọn */}
            <p className="text-gray-700 mt-4 mb-4">
              {streetAddress && `${streetAddress}, `}
              {selectedWard?.label && `${selectedWard.label}, `}
              {selectedDistrict?.label && `${selectedDistrict.label}, `}
              {selectedProvince?.label && `${selectedProvince.label}`}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Ghi chú</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Ghi chú đơn hàng"
            />
          </div>
        </div>

        {/* Danh sách sản phẩm trong giỏ hàng */}
        <div className="w-full md:w-1/2 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl text-cyan-800 font-bold mb-4">GIỎ HÀNG</h2>

          {loading ? (
            <p className="text-center text-gray-500">Đang tải...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Giỏ hàng trống</p>
          ) : (
            <div className="flex flex-col gap-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b pb-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <p className="font-bold text-cyan-800">{item.name}</p>
                    <p>Size: {item.size}</p>
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          handleDecrease(item.documentId, item.quantity)
                        }
                        className="border px-2"
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleIncrease(item.documentId, item.quantity)
                        }
                        className="border px-2"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-red-500">
                      {(item.price * item.quantity).toLocaleString()}₫
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.documentId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-5">
            <div className=" flex space-x-2 mt-4 text-lg font-bold">
              <p className="text-cyan-800">Tổng:</p>
              <p className="text-red-500">{totalPrice.toLocaleString()} đ</p>
            </div>
            <button
              className="relative w-full bg-orange-500 text-white p-2 rounded border border-transparent overflow-hidden
                            before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100
                            hover:text-red-500 hover:border-red-500"
              // onClick={() => {
              //   handleCheckout();
              // }}
              onClick={handleOrder}
            >
              <span className="relative z-10 b-5">Đặt Hàng</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default CartPage;
