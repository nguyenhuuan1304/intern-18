import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/hooks/useAxios";

interface RatingState {
    ratings: any[];
    loading: boolean;
    error: string | null;
}

const initialState: RatingState = {
    ratings: [],
    loading: false,
    error: null,
};

// Async action để fetch đánh giá
export const fetchRatings = createAsyncThunk("rating/fetchRatings", async () => {
    const response = await api.get("/ratings?populate=*&pagination[limit]=1000");
    return response.data.data.map((rating: any) => ({
        ...rating,
        img: rating.img
            ? rating.img.map((img: any) => ({
                  id: img.id,
                  url: `${api.defaults.baseURL}${img.url}`,
              }))
            : [],
    }));
});

// Async action để tạo đánh giá mới
export const createRating = createAsyncThunk(
    "rating/createRating",
    async ({ username, rating, description, product, images }: { username: string; rating: number; description: string; product: string; images?: File[] }) => {
        let imageIds: number[] = [];

        if (images && images.length > 0) {
            const formData = new FormData();
            images.forEach((image) => formData.append("files", image));

            const uploadResponse = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            imageIds = uploadResponse.data.map((img: any) => img.id);
        }

        const payload = {
            data: { username, rating, description, product, img: imageIds.length ? imageIds : undefined },
        };

        const response = await api.post("/ratings", payload);
        return response.data;
    }
);

const ratingSlice = createSlice({
    name: "rating",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRatings.fulfilled, (state, action) => {
                state.ratings = action.payload;
                state.loading = false;
            })
            .addCase(fetchRatings.rejected, (state, action) => {
                state.error = action.error.message || "Lỗi khi lấy đánh giá";
                state.loading = false;
            })
            .addCase(createRating.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRating.fulfilled, (state, action) => {
                state.ratings.push(action.payload);
                state.loading = false;
            })
            .addCase(createRating.rejected, (state, action) => {
                state.error = action.error.message || "Lỗi khi gửi đánh giá";
                state.loading = false;
            });
    },
});

export default ratingSlice.reducer;
