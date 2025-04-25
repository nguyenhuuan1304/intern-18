import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { fetchRatings } from "@/store/ratingSlice";
import ReviewForm from "./ReviewForm";
import { useParams } from "react-router-dom";
import avata from "@/assets/anh-banner-1.webp";
import { FaStar } from "react-icons/fa";

const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ReviewSection: React.FC = () => {
    const { ratings } = useSelector((state: RootState) => state.rating);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [visibleCount, setVisibleCount] = useState(3);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { documentId } = useParams<{ documentId: string }>();

    useEffect(() => {
        dispatch(fetchRatings());
    }, [dispatch]);

    // Lọc đánh giá theo documentId của sản phẩm
    const productRatings = ratings.filter((rating) => rating.product?.documentId === documentId);

    // Thống kê đánh giá
    const ratingCount = productRatings.length;
    const averageRating = ratingCount > 0
        ? productRatings.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 0;

    // Phân phối số sao
    const ratingDistribution = productRatings.reduce((acc, { rating }) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
    }, {} as { [key: number]: number });

    // Lọc theo số sao được chọn
    const filteredRatings = selectedRating !== null
        ? productRatings.filter((r) => r.rating === selectedRating)
        : productRatings;

    return (
        <div className="border-t mt-4">
            <motion.div
                className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-2 md:p-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            {averageRating.toFixed(1)}
                        </h1>
                        <p className="text-gray-600">({ratingCount} đánh giá)</p>
                    </div>
                    <button
                        className="cursor-pointer mt-3 sm:mt-0 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                        onClick={() => setIsReviewFormOpen(true)}
                    >
                        GỬI ĐÁNH GIÁ CỦA BẠN
                    </button>
                </div>

                {/* Thanh đánh giá */}
                <div className="space-y-3 mb-6">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingDistribution[star] || 0;
                        const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
                        return (
                            <div className="flex items-center" key={star}>
                                <span className="w-12 text-gray-600">{star} sao</span>
                                <div className="flex-1 h-4 bg-gray-200 rounded-lg mx-4">
                                    <div className="h-4 bg-yellow-500 rounded-lg" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="text-gray-600 w-24">{percentage.toFixed(1)}% | {count}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Bộ lọc */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Lọc theo:</h2>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedRating(null)}
                            className={`cursor-pointer px-4 py-2 rounded-lg ${selectedRating === null ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                        >
                            Tất cả
                        </button>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button
                                key={star}
                                onClick={() => setSelectedRating(star)}
                                className={`cursor-pointer px-4 py-2 rounded-lg ${selectedRating === star ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                            >
                                {star} sao
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danh sách đánh giá */}
                <div className="mt-6 space-y-4">
                    {filteredRatings.length > 0 ? (
                        <>
                            {filteredRatings.slice(0, visibleCount).map((review) => (
                                <div key={review.id} className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md">
                                    {/* Avatar và tên người dùng */}
                                    <div className="flex items-center space-x-2 sm:w-1/3 w-full mb-3 sm:mb-0">
                                        <img className="w-10 h-10 rounded-full" src={avata} alt="avata" />
                                        <p className="text-cyan-700">{review.username || "Người dùng ẩn danh"}</p>
                                    </div>

                                    {/* Nội dung đánh giá */}
                                    <div className="sm:w-2/3 w-full">
                                        <div className="flex flex-wrap items-center space-x-2">
                                            <div className="flex">
                                                {Array.from({ length: review.rating }).map((_, i) => (
                                                    <span key={i} className="text-yellow-500 text-lg"><FaStar /></span>
                                                ))}
                                            </div>
                                            {review.rating === 5 && <span className="text-green-600">Cực kì hài lòng!</span>}
                                            {review.rating === 4 && <span className="text-blue-600">Hài lòng!</span>}
                                            {review.rating === 3 && <span className="text-yellow-600">Bình thường!</span>}
                                            {review.rating === 2 && <span className="text-orange-600">Chưa tốt lắm!</span>}
                                            {review.rating === 1 && <span className="text-red-600">Không hài lòng!</span>}
                                        </div>

                                        <p className="text-gray-700">{review.description}</p>

                                        {/* Ảnh đánh giá */}
                                        {review.img && review.img.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {review.img.map((image: { id: number; name: string; url: string; }) => {
                                                    let imageUrl = image.url.replace("/api/", "/");
                                                    return (
                                                        <img
                                                            key={image.id}
                                                            src={imageUrl}
                                                            alt={image.name || "Review Image"}
                                                            className="w-24 h-24 object-cover rounded-md"
                                                            onError={(e) => { e.currentTarget.src = "/fallback-image.jpg"; }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Nút "Xem thêm" & "Thu gọn" */}
                            {filteredRatings.length > 3 && (
                                filteredRatings.length > visibleCount ? (
                                    <button
                                        onClick={() => setVisibleCount((prev) => prev + 3)}
                                        className="cursor-pointer text-blue-500 mt-2"
                                    >
                                        Xem thêm
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setVisibleCount(3)}
                                        className="cursor-pointer text-red-500 mt-2"
                                    >
                                        Thu gọn
                                    </button>
                                )
                            )}

                        </>
                    ) : (
                        <p className="text-gray-600 text-center mt-4">Chưa có đánh giá nào.</p>
                    )}
                </div>

                {/* Form đánh giá */}
                {isReviewFormOpen && documentId && (
                    <ReviewForm onClose={() => setIsReviewFormOpen(false)} documentId={documentId} />
                )}
            </motion.div>
        </div>
    );
};

export default ReviewSection;