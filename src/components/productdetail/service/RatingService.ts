import axios from "axios";

const API_URL = "http://localhost:1337/api/ratings";
const API_URL_GET = "http://localhost:1337/api/ratings?populate=*";
const UPLOAD_URL = "http://localhost:1337/api/upload";

export const createRating = async (ratingData: { 
    rating: number; 
    description: string; 
    product: string; 
    images?: File[] 
}) => {
    try {
        console.log("🔍 Dữ liệu gửi lên:", ratingData);

        let imageIds: number[] = [];

        // Upload ảnh nếu có
        if (ratingData.images && ratingData.images.length > 0) {
            const formData = new FormData();
            ratingData.images.forEach((image) => {
                formData.append("files", image);
            });

            const uploadResponse = await axios.post(UPLOAD_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Lấy danh sách ID ảnh từ API
            imageIds = uploadResponse.data.map((img: any) => img.id);
        }

        // Gửi dữ liệu đánh giá
        const payload = {
            data: {
                rating: ratingData.rating,
                description: ratingData.description,
                product: ratingData.product,
                img: imageIds.length ? imageIds : undefined, 
            },
        };

        const response = await axios.post(API_URL, payload, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("Đánh giá đã được gửi:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi gửi đánh giá:", error.response?.data || error);
        throw error;
    }
};

export const fetchRatings = async () => {
    try {
        const response = await axios.get(API_URL_GET);
        return response.data.data.map((rating: any) => ({
            ...rating,
            img: rating.img ? rating.img.map((img: any) => ({
                id: img.id,
                url: `http://localhost:1337${img.url}`,
            })) : [],
        }));
    } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
        return [];
    }
};