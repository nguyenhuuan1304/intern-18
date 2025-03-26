import React, { useEffect } from "react";
import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCartItems, removeCartItem, updateCartItemQuantity } from "@/store/cartSlice";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
    cartDrawerOpen: boolean;
    setCartDrawerOpen: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ cartDrawerOpen, setCartDrawerOpen }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: cartItems, loading, error } = useSelector((state: RootState) => state.cart);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (cartDrawerOpen) {
            dispatch(fetchCartItems());
        }
    }, [cartDrawerOpen, dispatch]);

    const handleIncrease = (documentId: string, currentQuantity: number) => {
        dispatch(updateCartItemQuantity({ documentId, quantity: currentQuantity + 1 }));
    };

    const handleDecrease = (documentId: string, currentQuantity: number) => {
        if (currentQuantity > 1) {
            dispatch(updateCartItemQuantity({ documentId, quantity: currentQuantity - 1 }));
        }
    };

    const handleRemove = (documentId: string) => {
        dispatch(removeCartItem(documentId));
    };

    const handleGoToProduct = () => {
        setCartDrawerOpen(false);
        navigate("/product");
    };

    const handleCheckout = () => {
        setCartDrawerOpen(false);
        navigate("/cart");
    };

    return (
        <Drawer
            title="Giỏ hàng"
            placement="right"
            onClose={() => setCartDrawerOpen(false)}
            open={cartDrawerOpen}
            width={400}
        >
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
                                        onClick={() => handleDecrease(item.documentId, item.quantity)}
                                        className="border px-2"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button
                                        onClick={() => handleIncrease(item.documentId, item.quantity)}
                                        className="border px-2"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-red-500">{(item.price * item.quantity).toLocaleString()}₫</p>
                            </div>
                            <button onClick={() => handleRemove(item.documentId)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {cartItems.length > 0 && (
                <div className="mt-4 flex justify-between">
                    <button
                        className="relative w-1/3 bg-blue-500 text-white p-2 rounded border border-transparent overflow-hidden
                             before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100
                             hover:text-blue-500 hover:border-blue-500"
                        onClick={handleGoToProduct}
                    >
                        <span className="relative z-10">Mua thêm</span>
                    </button>

                    <button
                        className="relative w-1/3 bg-red-500 text-white p-2 rounded border border-transparent overflow-hidden
                             before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100
                             hover:text-red-500 hover:border-red-500"
                        onClick={handleCheckout}
                    >
                        <span className="relative z-10">Thanh toán</span>
                    </button>
                </div>
            )}
        </Drawer>
    );
};

export default CartDrawer;
