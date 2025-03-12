import React, { useState } from "react";
import { Product } from "./types/ProductType";

interface AddProductProps {
    product: Product | null;
    onClose: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ product, onClose }) => {
    if (!product) return null;

    const [quantities, setQuantities] = useState<Record<string, number>>({});

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

    return (
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

            <div className="flex gap-4 justify-center">
                <button className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer" onClick={onClose}>Đóng</button>
                <button className="px-4 py-2 bg-green-700 text-white rounded cursor-pointer">Đặt Ngay</button>
                <button className="px-4 py-2 bg-blue-700 text-white rounded cursor-pointer">Thêm Giỏ Hàng</button>
            </div>
        </div>
    );
};

export default AddProduct;