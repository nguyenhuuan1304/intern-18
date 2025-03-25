import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

interface CartItem {
  id: number;
  name: string;
  size: number;
  price: number;
  image: string;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  const [cart] = useState<CartItem[]>([
    {
      id: 1,
      name: "GIÀY BÓNG ĐÁ KAWIN KW501 BẠC CAM",
      size: 42,
      price: 185000,
      image:
        "https://cdn2-retail-images.kiotviet.vn/2025/03/11/locsporthcm/607e3eae5220486688933ece430ca567.jpg",
    },
    {
      id: 2,
      name: "GIÀY BÓNG ĐÁ KAWIN KW502 ĐỎ ĐEN",
      size: 41,
      price: 190000,
      image:
        "https://cdn2-retail-images.kiotviet.vn/2025/03/11/locsporthcm/some-other-image.jpg",
    },
  ]);

  // Tính tổng tiền
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const stripe = await loadStripe(
        "pk_test_51R66O0DftvJgslwBKdVOWz4UJ7sdpk6W9ALddQgPs3XBYQCV46xaDSgSqYpWAFZevhLYKgFyPAmp4wLm7THP3r0400LXhtMelk"
      );

      const response = await fetch("http://localhost:1337/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orders: cart.map((item) => ({
            productId: item.id,
            quantity: 1,
          })),
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);
      if (!data.stripeSession?.id) throw new Error("Failed to create session");

      await stripe?.redirectToCheckout({
        sessionId: data.stripeSession.id,
      });
    } catch (err) {
      setError("Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-all text-sm md:text-base h-10 md:h-9 w-[110px] md:w-[150px] justify-center"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Quay lại</span>
        </button>
      </div>
      <hr />

      <div className="flex flex-col md:flex-row p-4">
        <div className="w-full md:w-2/3 p-4">
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
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Địa chỉ</label>
            <p className="text-blue-500 cursor-pointer">Địa chỉ khác</p>
            <p className="mt-2">Tiền Vệ Football</p>
            <p>
              83/5 Huỳnh Văn Lũy, P.Phú Lợi, TP. Thủ Dầu Một, Bình Dương, Phường
              Phú Lợi, Thành Phố Thủ Dầu Một, Tỉnh Bình Dương
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ghi chú</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Ghi chú"
            ></textarea>
          </div>
        </div>

        {/* Phần giỏ hàng */}
        <div className="w-full md:w-1/3 p-4 bg-gray-100 shadow-lg">
          <h2 className="text-xl text-cyan-800 font-bold mb-4">GIỎ HÀNG</h2>

          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 mr-4"
                />
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p>Size: {item.size}</p>
                  <p>{item.price.toLocaleString()}₫</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
          )}

          <div className="flex justify-between mb-4">
            <span>Tạm tính</span>
            <span>{totalPrice.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Tổng tiền</span>
            <span className="font-bold text-red-500">
              {totalPrice.toLocaleString()}₫
            </span>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className={`relative w-full bg-red-500 text-white p-2 rounded border border-transparent overflow-hidden
              before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100 hover:text-red-500 hover:border-red-500 ${
                loading || cart.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
          >
            {loading ? (
              <span className="relative z-10">Đang xử lý...</span>
            ) : (
              <span className="relative z-10">Đặt Hàng</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CartPage;
