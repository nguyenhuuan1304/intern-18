import React, { useState } from "react";
import { Product } from "./types/ProductType";
import CartDrawer from "../cart/CartDrawer";
import { useAppDispatch } from "../../store/store";
import { addToCartApi } from "@/store/cartSlice";
import { useNavigate } from "react-router-dom";

interface AddProductProps {
    product: Product;
    onClose: () => void;
    cartDrawerOpen: boolean;
    imageUrl?: string;
    setCartDrawerOpen: (open: boolean) => void;
}

const AddProduct: React.FC<AddProductProps> = ({ product, onClose, imageUrl, cartDrawerOpen, setCartDrawerOpen }) => {
    if (!product) return null;

    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const dispatch = useAppDispatch();
    const [error, setError] = useState<string>("");
    const stockData = product.inventory.reduce<Record<string, number>>((acc, item) => {
        acc[item.size] = (acc[item.size] || 0) + item.quantity;
        return acc;
    }, {});
    const discountPercent = product.product_sale?.percent_discount ?? 0;
    const finalPrice = product.prices - (product.prices * discountPercent) / 100;

    const handleQuantityChange = (size: string, delta: number) => {
        setQuantities((prev) => {
            const availableStock = stockData[size] || 0;
            const newQty = (prev[size] || 0) + delta;
            return newQty >= 0 && newQty <= availableStock
                ? { ...prev, [size]: newQty }
                : prev;
        });
    };
    

    const totalQuantity = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
    const totalPrice = totalQuantity * (finalPrice || 0);
    const navigate = useNavigate();

    const handleAddToCart = async () => {
        if (totalQuantity === 0) {
            setError("Vui lòng chọn số lượng trước khi thêm vào giỏ hàng!");
            return;
        }

        setError("");
        const selectedSizes = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([size, qty]) => ({
                documentId: product.documentId,
                name: product.name,
                price: finalPrice,
                size,
                quantity: qty,
                image: imageUrl || "",
                product: {
                    documentId: product?.documentId ?? "",
                    name: product?.name ?? ""
                },
                products: [{ documentId: product.documentId }],
            }));

        if (selectedSizes.length > 0) {
            for (const item of selectedSizes) {
                dispatch(addToCartApi(item));
            }
            setCartDrawerOpen(true);
        }
    };

    const handleBuyNow = async () => {
        if (totalQuantity === 0) {
            setError("Vui lòng chọn số lượng trước khi mua hàng!");
            return;
        }

        setError("");
        const selectedSizes = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([size, qty]) => ({
                documentId: product.documentId,
                name: product.name,
                price: finalPrice,
                size,
                quantity: qty,
                image: imageUrl || "",
                product: {
                    documentId: product?.documentId ?? "",
                    name: product?.name ?? ""
                },
                products: [{ documentId: product.documentId }],
            }));

        if (selectedSizes.length > 0) {
            for (const item of selectedSizes) {
                dispatch(addToCartApi(item));
            }
            navigate("/cart");
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
                        {Object.entries(stockData).map(([size, stock]) => (
                            <tr key={size}>
                                <td className="border border-gray-300 px-4 py-2">Size {size}</td>
                                <td className="border border-gray-300 px-4 py-2">{stock}</td>
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
                                        disabled={(quantities[size] || 0) >= stock}
                                    >
                                        +
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between mb-4">
                    <span>Thành tiền:</span>
                    <span className="text-red-500">{totalPrice.toLocaleString()}₫</span>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="flex gap-4 justify-center">
                    <button className="px-4 py-2 bg-gray-700 text-white rounded" onClick={onClose}>Đóng</button>
                    <button className="px-4 py-2 bg-green-700 text-white rounded" onClick={handleBuyNow}>Đặt Ngay</button>
                    <button className="px-4 py-2 bg-blue-700 text-white rounded" onClick={handleAddToCart}>Thêm Giỏ Hàng</button>
                </div>
            </div>
            <CartDrawer cartDrawerOpen={cartDrawerOpen} setCartDrawerOpen={setCartDrawerOpen} />
        </>
    );
};

export default AddProduct;
