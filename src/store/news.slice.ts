import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '@/hooks/useAxios'
import { TypeDataNews } from '@/pages/news/typeNews'
import { create } from 'domain';

interface TypeList {
    news: TypeDataNews[],
    editingPost: TypeDataNews | null,
    // loading: boolean,
    // currentRequestId: undefined | string
}

const initialState: TypeList = {
    news: [],
    editingPost: null
}

interface ApiResponse<T> {
    data: T;
}


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
                introduction: post.introduction,
                slug: post.slug,
              }
            };
            console.log(formattedPost)
            const response = await api.post("news", formattedPost, {
              signal: thunkAPI.signal,
            });
            if(response.status === 200) {
                console.log('ok')
                return response.data.data;
            }
        } catch (error) {
            console.log(error)
            throw error
        }
})

export const deleteNews = createAsyncThunk('news/deleteNews',
    async (id : string, thunkAPI) => {
        try {
            const response = await api.delete<TypeDataNews>(`/news/${id}` , {
                signal: thunkAPI.signal
            });
            if(response.status === 200) {
                return response.data
            }
        } catch (error) {
            console.error(error)
        }
})

export const updateNews = createAsyncThunk('news/updateNews',
    async ({body, id} : {body :TypeDataNews , id: string}, thunkAPI) => {
        console.log(id)
        try {
            const formattedPost = {
                data: {
                    name: body.name,
                    img: body.img,
                    description: body.description, 
                    introduction: body.introduction,
                    slug: body.slug,
                    rating_news: [108,110,112,114]
              }
            };
            const response = await api.put<TypeDataNews>(`news/${id}`, formattedPost, {
                signal: thunkAPI.signal,    
                // params: {
                //    populate: '*',
                // }
            })
            if(response.status === 200) {
                console.log('ok')
                return response.data;
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

export const searchNews = createAsyncThunk('news/searchNews',
    async (value: string, thunkAPI) => {
        try {
            const res = await api.get(`news?filters[name][$contains]=${value}`,{
                signal: thunkAPI.signal
            })
            if(res.status) {
                return res.data.data
            }
        } catch (error) {
            console.error(error)
        }
    }
) 


export const newtState = createSlice({
  name: 'news',
  initialState,
  reducers: {
    startEditingNews: (state, action) => {
        const newsId = action.payload;
        const news = state.news.find((post) => post.documentId === newsId);
        state.editingPost = news || null;
    }
    
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
    .addCase(deleteNews.fulfilled, (state,action) => {
        // const postIdd = action.meta.arg;
        // console.log(postIdd === action.payload.id)//true
        const postId = state.news.findIndex(news => news.documentId === (action.payload?.documentId))
        state.news.splice(postId,1);
    })  
    .addCase(updateNews.fulfilled, (state,action) => {
        const newsId = action.payload?.documentId
        state.news.some((item,index) => {
            if(item.documentId === newsId) {
                if (action.payload) {
                    state.news[index] = action.payload;
                }
                return 
            }
            return false
        })
    })
    .addCase(searchNews.fulfilled , (state, action) => {
        state.news = action.payload
    })

  },
})

// Action creators are generated for each case reducer function
export const {startEditingNews} = newtState.actions

export default newtState.reducer