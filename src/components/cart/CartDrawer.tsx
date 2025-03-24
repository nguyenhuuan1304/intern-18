// import React from "react";
// import { Drawer } from "antd";
// import { Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface CartDrawerProps {
//     cartItems: any[];
//     cartDrawerOpen: boolean;
//     setCartDrawerOpen: (open: boolean) => void;
//     setCartItems: (items: any[]) => void;
//     imageUrl?: string;
// }

// const CartDrawer: React.FC<CartDrawerProps> = ({ cartItems, cartDrawerOpen, imageUrl, setCartDrawerOpen, setCartItems }) => {
//     const navigate = useNavigate();
//     const handleRemoveItem = (index: number) => {
//         setCartItems(cartItems.filter((_, i) => i !== index));
//     };

//     const handleGoToProduct = () => {
//         setCartDrawerOpen(false);
//         navigate("/product");
//     };

//     const handleCheckout = () => {
//         setCartDrawerOpen(false);
//         navigate("/cart");
//     };

//     const handleQuantityChange = (index: number, delta: number) => {
//         setCartItems(cartItems.map((item, i) => 
//             i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
//         ));
//     };

//     return (
//         <Drawer
//             title="Giỏ hàng"
//             placement="right"
//             onClose={() => setCartDrawerOpen(false)}
//             open={cartDrawerOpen}
//             width={400}
//         >
//             <div className="flex flex-col gap-4">
//                 {cartItems.length === 0 ? (
//                     <p className="text-center text-gray-500">Giỏ hàng trống</p>
//                 ) : (
//                     cartItems.map((item, index) => (
//                         <div key={index} className="flex items-center gap-4 border-b pb-2">
//                             <img src={imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
//                             <div className="flex-1 space-y-2">
//                                 <p className="font-bold text-cyan-800">{item.name}</p>
//                                 <p>Size: {item.size}</p>
//                                 <div className="flex items-center gap-2">
//                                     <button 
//                                         className="px-2 py-1 bg-gray-200 rounded" 
//                                         onClick={() => handleQuantityChange(index, -1)}
//                                     >-</button>
//                                     <p className="w-6 text-center">{item.quantity}</p>
//                                     <button 
//                                         className="px-2 py-1 bg-gray-200 rounded" 
//                                         onClick={() => handleQuantityChange(index, 1)}
//                                     >+</button>
//                                 </div>
//                                 <p className="text-red-500">{(item.price * item.quantity).toLocaleString()}₫</p>
//                             </div>

//                             <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
//                                 <Trash2 size={20} />
//                             </button>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {cartItems.length > 0 && (
//                 <div className="mt-4 flex justify-between">
//                     <button
//                         className="relative w-1/3 bg-blue-500 text-white p-2 rounded border border-transparent overflow-hidden
//                             before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100
//                             hover:text-blue-500 hover:border-blue-500"
//                         onClick={handleGoToProduct}
//                     >
//                         <span className="relative z-10">Mua thêm</span>
//                     </button>

//                     <button
//                         className="relative w-1/3 bg-red-500 text-white p-2 rounded border border-transparent overflow-hidden
//                             before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100
//                             hover:text-red-500 hover:border-red-500"
//                         onClick={handleCheckout}
//                     >
//                         <span className="relative z-10">Thanh toán</span>
//                     </button>
//                 </div>
//             )}
//         </Drawer>
//     );
// };

// export default CartDrawer;

import React, { useEffect } from "react";
import { Drawer } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCartItems, removeCartItem, updateCartItemQuantity } from "@/store/cartSlice";
import { Trash2 } from "lucide-react";

interface CartDrawerProps {
    cartDrawerOpen: boolean;
    setCartDrawerOpen: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ cartDrawerOpen, setCartDrawerOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { items: cartItems, loading, error } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        if (cartDrawerOpen) {
            dispatch(fetchCartItems());
        }
    }, [cartDrawerOpen, dispatch]);

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
        </Drawer>
    );
};

export default CartDrawer;
