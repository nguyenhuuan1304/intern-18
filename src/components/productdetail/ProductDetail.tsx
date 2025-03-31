import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "@/store/store";
import { fetchProducts } from "@/store/productSlice";
import { Send, Star, X } from "lucide-react";
import ReviewSection from "./ReviewSection";
import SaleSection from "../product/SaleSession";
import { addToCartApi } from "@/store/cartSlice";
import { useNavigate } from "react-router-dom";

const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProductDetail: React.FC = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const { products, loading, error } = useSelector((state: RootState) => state.products);
    const productDetail = products.find((p) => p.documentId === documentId);
    const [showSizeForm, setShowSizeForm] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const discountPercent = productDetail?.product_sale?.percent_discount ?? 0;
    const finalPrice = (productDetail?.prices ?? 0) - ((productDetail?.prices ?? 0) * discountPercent) / 100;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!products.length) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    // const hasStock = () => {
    //     const hasShoeStock = productDetail?.id_shoe
    //         ? Object.entries(productDetail.id_shoe)
    //             .filter(([key, value]) => key.startsWith("S") && typeof value === "number")
    //             .some(([_, value]) => value > 0)
    //         : false;

    //     const hasShirtPantStock = productDetail?.id_shirt_pant
    //         ? Object.entries(productDetail.id_shirt_pant)
    //             .filter(([key, value]) => ["S", "M", "L", "XL", "XXL"].includes(key) && typeof value === "number")
    //             .some(([_, value]) => value > 0)
    //         : false;

    //     return hasShoeStock || hasShirtPantStock;
    // };

    // const availableSizes = () => {
    //     const shoeSizes = productDetail?.id_shoe
    //         ? Object.entries(productDetail.id_shoe)
    //             .filter(([key, value]) => key.startsWith("S") && typeof value === "number" && value > 0)
    //             .map(([key]) => key)
    //         : [];

    //     const shirtPantSizes = productDetail?.id_shirt_pant
    //         ? Object.entries(productDetail.id_shirt_pant)
    //             .filter(([key, value]) => ["S", "M", "L", "XL", "XXL"].includes(key) && typeof value === "number" && value > 0)
    //             .map(([key]) => key)
    //         : [];

    //     return [...shoeSizes, ...shirtPantSizes];
    // };
    const hasStock = () => {
        return productDetail?.inventory.some(item => item.quantity > 0);
    };

    const availableSizes = () => {
        return productDetail?.inventory?.filter(item => item.quantity > 0).map(item => item.size) || [];
    };

    const handleBuyNowClick = () => {
        setShowSizeForm(true);
    };

    const closeModal = () => {
        setShowSizeForm(false);
    };

    const productImageUrl = productDetail?.Image?.length
        ? productDetail.Image[0].url
        : "";

    const handleConfirmBuyNow = () => {
        if (!selectedSize) {
            alert("Vui lòng chọn kích thước sản phẩm.");
            return;
        }

        const cartItem = {
            documentId: productDetail?.documentId ?? "",
            name: productDetail?.name ?? "",
            size: selectedSize,
            quantity: quantity,
            price: finalPrice,
            image: productImageUrl,
            product: {
                documentId: productDetail?.documentId ?? "",
                name: productDetail?.name ?? ""
            },
            products: [{ documentId: productDetail?.documentId }],
        };

        dispatch(addToCartApi(cartItem))
            .unwrap()
            .then(() => {
                navigate("/cart");
            })
            .catch((error) => {
                console.error("Lỗi khi thêm vào giỏ hàng:", error);
            });
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!productDetail) return <p className="text-gray-500">Không tìm thấy sản phẩm.</p>;

    return (
        <div className="p-6 min-h-screen">
            {/* Product Section */}
            <motion.div
                className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg flex flex-wrap"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="w-full md:w-1/2 p-4">
                    {productDetail?.product_sale?.percent_discount ? (
                        <div className="relative overflow-hidden">
                            <img
                                src={productImageUrl}
                                alt={productDetail.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-[-40px] bg-orange-600 text-white px-10 py-1 text-sm font-bold rounded transform -rotate-45">
                                SALE -{productDetail.product_sale.percent_discount}%
                            </div>
                        </div>
                    ) : (
                        <img
                            src={productDetail?.Image?.length ? productDetail.Image[0].url : "https://via.placeholder.com/300"}
                            alt={productDetail?.name}
                            className="w-full h-auto rounded-lg"
                        />
                    )}
                </div>

                {/* product detail */}
                <div className="w-full md:w-1/2 p-6 space-y-5">
                    <h1 className="text-xl md:text-2xl font-bold text-cyan-800">
                        {productDetail?.name}
                    </h1>

                    <div className="flex items-center space-x-1 text-sm font-bold">
                        {[...Array(5)].map((_, index) => (
                            <Star key={index} className={index < Math.round(productDetail.rating || 0) ? "text-yellow-500" : "text-gray-300"} />
                        ))}
                        <p className="ml-2 text-gray-600">({productDetail.ratingCount} đánh giá)</p>
                    </div>

                    <p className="text-gray-700 text-sm md:text-base">
                        {productDetail?.product_detail?.description.split("\n").map((line, index) => (
                            <span key={index}>{line}<br /></span>
                        ))}
                    </p>

                    <div className="flex space-x-2">
                        <p>Tình trạng:</p>
                        <p className={`text-sm px-2 rounded-lg ${hasStock() ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                            {hasStock() ? "Còn hàng" : "Hết hàng"}
                        </p>
                    </div>

                    {productDetail?.product_sale?.percent_discount ? (
                        <div className="flex space-x-2">

                            <p className="text-gray-500 line-through">
                                {productDetail.prices.toLocaleString()}đ
                            </p>

                            <p className="text-red-500 text-base font-bold">
                                {(
                                    productDetail.prices -
                                    (productDetail.prices * productDetail.product_sale.percent_discount) / 100
                                ).toLocaleString()}đ
                            </p>
                        </div>
                    ) : (

                        <p className="text-red-500 text-base font-bold">
                            {productDetail?.prices.toLocaleString()}đ
                        </p>
                    )}

                    <button
                        onClick={handleBuyNowClick}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg"
                    >
                        Mua ngay
                    </button>

                    <div className="relative w-full">
                        <input
                            type="number"
                            placeholder="Vui lòng nhập số điện thoại nếu bạn muốn tư vấn sỉ"
                            className="w-full h-[40px] border border-gray-300 rounded-lg p-2 pr-10"
                        />
                        <Send className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 cursor-pointer hover:text-blue-500" />
                    </div>

                    {/* Form chọn size và số lượng */}
                    {showSizeForm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative">
                                <button onClick={closeModal} className="absolute top-2 right-2 text-red-500 hover:text-red-600">
                                    <X />
                                </button>
                                <h2 className="text-2xl text-cyan-800 font-bold mb-4 text-center">Chọn kích thước và số lượng</h2>
                                <p className="text-lg text-cyan-800 text-center">
                                    {productDetail?.name}
                                </p>
                                <img
                                    src={productImageUrl}
                                    alt={productDetail.name}
                                    className="w-[50%] h-[50%] object-cover"
                                />
                                <p className="font-bold text-red-500">
                                    {finalPrice.toLocaleString()}đ
                                </p>
                                <label className="block mb-2">Kích thước:</label>
                                <select
                                    className="w-full border rounded p-2"
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    <option value="">Chọn kích thước</option>
                                    {availableSizes().map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>

                                <label className="block mt-2">Số lượng:</label>
                                <input
                                    type="number"
                                    className="w-full border rounded p-2"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    min={1}
                                />

                                <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg w-full"
                                    onClick={handleConfirmBuyNow}
                                >
                                    Xác nhận mua ngay
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
            <ReviewSection />
            <SaleSection />
        </div>
    );
};

export default ProductDetail;
