import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: false , isError:false , success:false }

const orderIsDeliveredSlice = createSlice({
    name : 'OrderPay',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchOrderDeliverDetailfully(state, action){
            state.isLoading = false
            state.success = true
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
        resetTheDeliver(state, action){
            state.isLoading = false
            state.isError = false
            state.success = false
        }        
    }
})

export default orderIsDeliveredSlice

export const orderIsDeliveredActions = orderIsDeliveredSlice.actions