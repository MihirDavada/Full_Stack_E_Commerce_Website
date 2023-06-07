import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: false , isError:false , topProducts : []}


const topProductSlice = createSlice({
    name : 'topProductSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchTopProductSuccessfully(state, action){
            state.isLoading = false
            state.topProducts = action.payload
        },
        setTheError(state, action){
            state.isError = true
        }
    }
})

export default topProductSlice

export const topProductActions = topProductSlice.actions