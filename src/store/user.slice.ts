import { api } from "@/hooks/useAxios";
import { TypeUser } from "@/pages/admin/ManagerUser";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface TypeStateUser {
    user: TypeUser[],
    editingUser: TypeUser | null
}

const initialState: TypeStateUser = {
    user : [],
    editingUser: null
}

export const getListUser = createAsyncThunk('users/getListUser',
    async (_,thunkApi) => { 
        try {
            const res = await api.get<TypeUser[]>('users',{
                signal: thunkApi.signal
            })
            if(res.status === 200) {
                return res.data
            }
        } catch (error) {
            console.error('error',error)
        }
    }
)

export const editStatus = createAsyncThunk('users/editStatus',
    async({id , body} : {id:string, body: boolean }, thunkAPI) => {
        try {
            const data = {
                blocked: body
            }
            const res = await api.put<TypeUser>(`users/${id}` , data , {
                signal : thunkAPI.signal
            })
            console.log(res.data)
            if(res.status === 200) {
                return res.data
            }
        } catch (error) {
            console.error('error',error)
        }
    }
)

export const deleteUser = createAsyncThunk('users/deleteUser',
    async (id: string, thunkAPI) => {
        try {
            const res = await api.delete(`users/${id}`,{
                signal: thunkAPI.signal
            })
            if(res.status === 200) {
                return res.data
            }
        } catch (error) {
            console.error('error',error)
        }
    }
)

export const searchUser = createAsyncThunk('users/searchUser',
    async (value: string, thunkAPI) => {
        try {
            const res = await api.get(`users?filters[username][$contains]=${value}`,{
                signal: thunkAPI.signal
            })
            if(res.status === 200) {
                return res.data
            }
        } catch (error) {
            console.error('error',error)
        }
    }
)


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
        .addCase(getListUser.fulfilled , (state, action) => {
            state.user = action.payload || []
        })
        .addCase(editStatus.fulfilled, (state, action) => {
            const index = state.user.findIndex((user) => user.id === action.payload?.id)
            if(index !== -1) {
                state.user[index].blocked = !state.user[index].blocked
            } else {
                return state
            }
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            const index = state.user.findIndex((item) => item.id === action.payload?.id)
            if(index !== -1) {
                state.user.splice(index, 1) 
            }
        })
        .addCase(searchUser.fulfilled, (state,action) => {
            state.user = action.payload || []
        })            
    }
});

// export const {  } = userSlice.actions;

export default userSlice.reducer;