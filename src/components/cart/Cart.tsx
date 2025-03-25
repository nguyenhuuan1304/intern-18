import { ArrowLeft, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCartItems, removeCartItem, updateCartItemQuantity } from "@/store/cartSlice";

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { items: cartItems, loading, error } = useSelector((state: RootState) => state.cart);
    const user = JSON.parse(localStorage.getItem("user") || "{}"); 
    const email = user.email || "";

    useEffect(() => {
        dispatch(fetchCartItems());
    }, [dispatch]);

    const handleIncrease = (id: number, currentQuantity: number) => {
        dispatch(updateCartItemQuantity({ id, quantity: currentQuantity + 1 }));
    };

    const handleDecrease = (id: number, currentQuantity: number) => {
        if (currentQuantity > 1) {
            dispatch(updateCartItemQuantity({ id, quantity: currentQuantity - 1 }));
        }
    };

    const handleRemove = (id: number) => {
        dispatch(removeCartItem(id));
    };

    // Lấy dữ liệu giỏ hàng từ Redux
    const cart = useSelector((state: RootState) => state.cart.items);

    // Tính tổng tiền
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                <div className="w-full md:w-2/3 p-4">
                    <h2 className="text-xl text-cyan-800 font-bold mb-4">THÔNG TIN VẬN CHUYỂN</h2>
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
                            placeholder="Ghi chú đơn hàng"
                        />
                    </div>
                </div>

                {/* Danh sách sản phẩm trong giỏ hàng */}
                <div className="w-full md:w-1/3 p-4 bg-gray-100 rounded-lg">
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
                                <div key={index} className="flex items-center gap-4 border-b pb-2">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                                    <div className="flex-1 space-y-2">
                                        <p className="font-bold text-cyan-800">{item.name}</p>
                                        <p>Size: {item.size}</p>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleDecrease(item.id, item.quantity)}
                                                className="border px-2"
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <button
                                                onClick={() => handleIncrease(item.id, item.quantity)}
                                                className="border px-2"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-red-500">{(item.price * item.quantity).toLocaleString()}₫</p>
                                    </div>
                                    <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-700">
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
                        >
                            <span className="relative z-10">Đặt Hàng</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;
