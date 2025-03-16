import React from "react";
import { Drawer } from "antd";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
    cartItems: any[];
    cartDrawerOpen: boolean;
    setCartDrawerOpen: (open: boolean) => void;
    setCartItems: (items: any[]) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ cartItems, cartDrawerOpen, setCartDrawerOpen, setCartItems }) => {
    const navigate = useNavigate();

    const handleRemoveItem = (index: number) => {
        setCartItems([...cartItems.filter((_, i) => i !== index)]);
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
            <div className="flex flex-col gap-4">
                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500">Giỏ hàng trống</p>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 border-b pb-2">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                            <div className="flex-1 space-y-2">
                                <p className="font-bold text-cyan-800">{item.name}</p>
                                <p>Size: {item.size}</p>
                                <p>Số lượng: {item.quantity}</p>
                                <p className="text-red-500">{(item.price * item.quantity).toLocaleString()}₫</p>
                            </div>

                            <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))
                )}
            </div>

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