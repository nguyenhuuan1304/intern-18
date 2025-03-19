import React, { useState } from "react";
import { Product } from "./types/ProductType";
import CartDrawer from "../cart/CartDrawer";

interface AddProductProps {
    product: Product;
    onClose: () => void;
    cartDrawerOpen: boolean;
    setCartDrawerOpen: (open: boolean) => void;
}

const AddProduct: React.FC<AddProductProps> = ({ product, onClose, cartDrawerOpen, setCartDrawerOpen }) => {
    if (!product) return null;

    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [error, setError] = useState<string>(""); // State để hiển thị lỗi
    const stockData = product.id_shirt_pant || product.id_shoe || {};

    const handleQuantityChange = (size: string, delta: number) => {
        setQuantities((prev) => {
            const availableStock = stockData[size as keyof typeof stockData] || 0;
            const newQty = (prev[size] || 0) + delta;
            return newQty >= 0 && newQty <= availableStock
                ? { ...prev, [size]: newQty }
                : prev;
        });
    };

    const totalQuantity = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
    const totalPrice = totalQuantity * (product.prices || 0);

    const handleAddToCart = () => {
        if (totalQuantity === 0) {
            setError("Vui lòng chọn số lượng trước khi thêm vào giỏ hàng!");
            return;
        }

        setError("");
        const selectedSizes = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([size, qty]) => ({
                name: product.name,
                price: product.prices,
                size,
                quantity: qty,
            }));

        if (selectedSizes.length > 0) {
            setCartItems((prevItems) => [...prevItems, ...selectedSizes]);
            setCartDrawerOpen(true);
        }
    };

    return (
        <>
            <div className="p-6 w-[500px] mx-auto flex flex-col">
                <p className="text-xl font-bold mb-4 text-cyan-800 text-center">{product.name}</p>
                <table className="w-full border-collapse border border-gray-300 mb-4">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Sản phẩm</th>
                            <th className="border border-gray-300 px-4 py-2">Tồn kho</th>
                            <th className="border border-gray-300 px-4 py-2">Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(stockData).map(([size, stock]) =>
                            size !== "id" && size !== "documentId" ? (
                                <tr key={size}>
                                    <td className="border border-gray-300 px-4 py-2">Size {size}</td>
                                    <td className="border border-gray-300 px-4 py-2">{Number(stock)}</td>
                                    <td className="border border-gray-300 px-4 py-2 flex items-center">
                                        <button
                                            className="px-2 py-1 border border-gray-400"
                                            onClick={() => handleQuantityChange(size, -1)}
                                            disabled={(quantities[size] || 0) === 0}
                                        >
                                            -
                                        </button>
                                        <span className="mx-2">{quantities[size] || 0}</span>
                                        <button
                                            className="px-2 py-1 border border-gray-400"
                                            onClick={() => handleQuantityChange(size, 1)}
                                            disabled={(quantities[size] || 0) >= (stock as number)}
                                        >
                                            +
                                        </button>
                                    </td>
                                </tr>
                            ) : null
                        )}
                    </tbody>
                </table>

                <div className="flex justify-between mb-4">
                    <span>Đơn giá:</span>
                    <span>{product.prices.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span>Số lượng:</span>
                    <span>{totalQuantity}</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span>Thành tiền:</span>
                    <span className="text-red-500">{totalPrice.toLocaleString()}₫</span>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Hiển thị thông báo lỗi */}

                <div className="flex gap-4 justify-center">
                    <button
                        className="relative px-4 py-2 bg-gray-700 text-white rounded cursor-pointer border border-transparent overflow-hidden
                            before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100
                            hover:text-gray-700 hover:border-gray-700"
                        onClick={onClose}
                    >
                        <span className="relative z-10">Đóng</span>
                    </button>

                    <button
                        className="relative px-4 py-2 bg-green-700 text-white rounded cursor-pointer border border-transparent overflow-hidden
                            before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100
                            hover:text-green-700 hover:border-green-700"
                    >
                        <span className="relative z-10">Đặt Ngay</span>
                    </button>

                    <button
                        className="relative px-4 py-2 bg-blue-700 text-white rounded cursor-pointer border border-transparent overflow-hidden
                            before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100
                            hover:text-blue-700 hover:border-blue-700"
                        onClick={handleAddToCart}
                    >
                        <span className="relative z-10">Thêm Giỏ Hàng</span>
                    </button>

                </div>
            </div>

            <CartDrawer
                cartItems={cartItems}
                setCartItems={setCartItems}
                cartDrawerOpen={cartDrawerOpen}
                setCartDrawerOpen={setCartDrawerOpen}
            />
        </>
    );
};

export default AddProduct;