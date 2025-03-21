import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import ReviewForm from "./ReviewForm";
import { Product } from "@/components/product/types/ProductType";

const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface ReviewSectionProps {
    productDetail: Product | null;
    documentId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productDetail, documentId }) => {
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState<{ [key: number]: number }>({});
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [filteredRatings, setFilteredRatings] = useState<any[]>([]);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        if (productDetail) {
            const ratingsArray = productDetail.ratings || [];
            setRatingCount(ratingsArray.length);
            setAverageRating(productDetail.rating || 0);

            const distribution = ratingsArray.reduce(
                (acc: { [key: number]: number }, rating: { rating: number }) => {
                    acc[rating.rating] = (acc[rating.rating] || 0) + 1;
                    return acc;
                },
                {}
            );

            setRatingDistribution(distribution);
            setFilteredRatings(ratingsArray);
        }
    }, [productDetail]);

    useEffect(() => {
        if (selectedRating === null) {
            setFilteredRatings(productDetail?.ratings || []);
        } else {
            setFilteredRatings(productDetail?.ratings?.filter((r: any) => r.rating === selectedRating) || []);
        }
    }, [selectedRating, productDetail]);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 3);
    };

    const handleShowLess = () => {
        setVisibleCount(3);
    };

    return (
        <div className="border-t p-6 mt-4">
            <motion.div
                className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                {/* Overall Rating */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{averageRating.toFixed(1)}</h1>
                        <p className="text-gray-600">({ratingCount} đánh giá)</p>
                    </div>
                    <button
                        className="mt-3 sm:mt-0 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                        onClick={() => setIsReviewFormOpen(true)}
                    >
                        GỬI ĐÁNH GIÁ CỦA BẠN
                    </button>
                </div>

                {/* Detailed Ratings */}
                <div className="space-y-3 mb-6">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingDistribution[star] || 0;
                        const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
                        return (
                            <div className="flex items-center" key={star}>
                                <span className="w-12 text-gray-600">{star} sao</span>
                                <div className="flex-1 h-4 bg-gray-200 rounded-lg mx-4">
                                    <div
                                        className="h-4 bg-yellow-500 rounded-lg"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-gray-600 w-8">{percentage.toFixed(1)}%</span>
                            </div>
                        );
                    })}
                </div>

                {/* Filter Section */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Lọc theo:</h2>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedRating(null)}
                            className={`px-4 py-2 rounded-lg ${selectedRating === null ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                        >
                            Tất cả
                        </button>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button
                                key={star}
                                onClick={() => setSelectedRating(star)}
                                className={`px-4 py-2 rounded-lg ${selectedRating === star ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                            >
                                {star} sao
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danh sách đánh giá đã lọc */}
                <div className="mt-6 space-y-4">
                    {filteredRatings.length > 0 ? (
                        <>
                            {filteredRatings.slice(0, visibleCount).map((review, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <span key={i} className="text-yellow-500 text-lg"><Star /></span>
                                        ))}
                                    </div>
                                    <p className="text-gray-700">{review.description}</p>

                                    {/* Hiển thị ảnh nếu có */}
                                    {review.img && review.img.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {review.img.map((image: any) => (
                                                <img
                                                    key={image.id}
                                                    src={image.url}
                                                    alt="Review"
                                                    className="w-24 h-24 object-cover rounded-md"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Nút "Xem thêm" hoặc "Ẩn bớt" */}
                            <div className="flex justify-center mt-4">
                                {visibleCount < filteredRatings.length ? (
                                    <button
                                        onClick={handleShowMore}
                                        className="px-4 py-2 text-blue-500 rounded hover:text-blue-600"
                                    >
                                        Xem thêm
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleShowLess}
                                        className="px-4 py-2 text-red-500 rounded hover:text-red-600"
                                    >
                                        Ẩn bớt
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">Không có đánh giá nào.</p>
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