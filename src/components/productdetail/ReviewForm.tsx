import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createRating } from "@/store/ratingSlice";
import { AppDispatch, RootState } from "@/store/store";
import { FaStar } from "react-icons/fa";

interface ReviewFormProps {
    onClose: () => void;
    documentId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose, documentId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector((state: RootState) => state.rating.loading);
    const [rating, setRating] = useState(5);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const username = user.username || "";
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const fileArray = Array.from(event.target.files);
            setImages(fileArray);

            const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
            setPreviewImages(previewUrls);
        }
    };

    const handleSubmit = async () => {
        if (!documentId) {
            console.error("Không tìm thấy documentId!");
            return;
        }

        await dispatch(
            createRating({
                username,
                rating,
                description,
                product: documentId,
                images,
            })
        );

        onClose();
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl relative animate-fadeIn">
                <button className="cursor-pointer absolute top-2 right-2 text-red-500 hover:text-red-600" onClick={onClose}>
                    <X />
                </button>
    
                <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">Viết đánh giá của bạn</h2>
    
                <div className="flex justify-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                            onClick={() => setRating(star)}
                        >
                            <FaStar />
                        </span>
                    ))}
                </div>
    
                <textarea
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    placeholder="Nhập đánh giá của bạn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
    
                <input type="file" multiple ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="mb-3 hidden" />
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-2 w-full sm:w-auto"
                >
                    Đính kèm ảnh
                </button>
    
                <div className="flex space-x-2 overflow-x-auto">
                    {previewImages.map((src, index) => (
                        <img key={index} src={src} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                    ))}
                </div>
    
                <div className="flex justify-end space-x-2 mt-4">
                    <button className="cursor-pointer px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 w-full sm:w-auto" onClick={onClose}>
                        Hủy
                    </button>
                    <button
                        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full sm:w-auto"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );    
};

export default ReviewForm;
