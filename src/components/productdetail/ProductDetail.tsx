import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProducts } from "@/store/productSlice";
import { Send, Star } from "lucide-react";
import ReviewSection from "./ReviewSection";
import SaleSection from "../product/SaleSession";

const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProductDetail: React.FC = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const { products, loading, error } = useSelector((state: RootState) => state.products);
    const productDetail = products.find((p) => p.documentId === documentId);

    useEffect(() => {
        if (!products.length) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    const hasStock = () => {
        const hasShoeStock = productDetail?.id_shoe
            ? Object.entries(productDetail.id_shoe)
                .filter(([key, value]) => key.startsWith("S") && typeof value === "number")
                .some(([_, value]) => value > 0)
            : false;

        const hasShirtPantStock = productDetail?.id_shirt_pant
            ? Object.entries(productDetail.id_shirt_pant)
                .filter(([key, value]) => ["S", "M", "L", "XL", "XXL"].includes(key) && typeof value === "number")
                .some(([_, value]) => value > 0)
            : false;

        return hasShoeStock || hasShirtPantStock;
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!productDetail) return <p className="text-gray-500">Không tìm thấy sản phẩm.</p>;

    return (
        <div className="p-6 min-h-screen">
            {/* Product Section */}
            <motion.div
                className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg flex flex-wrap"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="w-full md:w-1/2 p-4">
                    {productDetail?.product_sale?.percent_discount ? (
                        <div className="relative overflow-hidden">
                            <img
                                src={productDetail.Image[0]?.url}
                                alt={productDetail.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-[-30px] bg-orange-600 text-white px-8 py-1 text-sm font-bold rounded transform -rotate-45">
                                -{productDetail.product_sale.percent_discount}%
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

                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg">
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
                </div>
            </motion.div>
            <ReviewSection productDetail={productDetail} documentId={documentId ?? ''} />
            <SaleSection/>
        </div>
    );
};

export default ProductDetail;
