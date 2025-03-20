import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '@/hooks/useAxios'
import { TypeDataNews } from '@/pages/news/typeNews'


interface TypeList {
    news: TypeDataNews[],
    // editingPost: TypePost | null,
    // loading: boolean,
    // currentRequestId: undefined | string
}
const initialState: TypeList = {
    news: []
}

// First, create the thunk
export const getPostListNews = createAsyncThunk('news/getPostListNews', 
    async(_, thunkAPI) => {
    const response = await api.get<TypeDataNews[]>('news?populate=*', {
        signal: thunkAPI.signal
    });
    return response.data.data;   
})

export const createNews = createAsyncThunk('news/postNews', 
    async(post: TypeDataNews, thunkAPI) => {
        try {
            const formattedPost = {
                data: {
                name: post.name,
                img: post.img,
                description: [
                {
                    type: "paragraph",
                    children: [
                    {
                        type: "text",
                        text: post.description, 
                      },
                    ],
                },
                ],
                slug: post.slug,
              }
            };
            const response = await api.post('news', formattedPost, {
              signal: thunkAPI.signal,
            });
            return response.data;
        } catch (error: any) {
            console.error("Lỗi khi tạo bài viết:", error.response?.data);
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
})



export const newtState = createSlice({
  name: 'news',
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {
    builder
    .addCase(getPostListNews.fulfilled, (state, action) => {
        state.news = action.payload
    })
    .addCase(createNews.fulfilled, (state, action) => {
        const data : TypeDataNews = action.payload
        console.log(data)
        state.news.push(data)
    })
  },
})

// Action creators are generated for each case reducer function
// export const {} = counterSlice.actions

export default newtState.reducer