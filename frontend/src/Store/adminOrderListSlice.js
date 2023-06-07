import { createSlice } from '@reduxjs/toolkit'

const initialState = {isLoading: false , isError:false , adminOrderList : []}

const adminOrderListSlice = createSlice({
    name : 'adminOrderListSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchOrderListSuccessfully(state, action){
            state.isLoading = false
            state.adminOrderList = action.payload
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
    }
})

export default adminOrderListSlice

export const adminOrderListAction = adminOrderListSlice.actions