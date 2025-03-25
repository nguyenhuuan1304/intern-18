import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '@/hooks/useAxios'
import { TypeDataNews } from '@/pages/news/typeNews'
import { parseDocument } from "htmlparser2";


interface TypeList {
    news: TypeDataNews[],
    // editingPost: TypePost | null,
    // loading: boolean,
    // currentRequestId: undefined | string
}

const initialState: TypeList = {
    news: []
}

interface ApiResponse<T> {
    data: T;
}


// First, create the thunk
export const getPostListNews = createAsyncThunk('news/getPostListNews', 
    async(_, thunkAPI) => {
    const response = await api.get<ApiResponse<TypeDataNews[]>>('news?populate=*', {
        signal: thunkAPI.signal
    });
    return response.data.data;   
})

export const createNews = createAsyncThunk('news/postNews', 
    async(post: TypeDataNews, thunkAPI) => {
        console.log(post)
        try {
            const formattedPost = {
                data: {
                name: post.name,
                img: post.img,
                description: post.description, 
                // description: [
                // {
                //     type: "paragraph",
                //     children: [
                //     {
                //         type: "text",
                //         text: post.description, 
                //       },
                //     ],
                // },
                // ],
                slug: post.slug,
              }
            };
            const response = await api.post("news", formattedPost, {
              signal: thunkAPI.signal,
            });
            if(response.status === 200) {
                console.log('ok')
                return response.data.data;
            } else {
                console.log('fail')
                return
            }
        } catch (error) {
            console.log(error)
            throw error
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