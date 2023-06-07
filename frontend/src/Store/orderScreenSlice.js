import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: true , isError:false , orderDetails:null}

const orderScreenSlice = createSlice({
    name : 'OrderScreen',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchOrderDetailfully(state, action){
            state.isLoading = false
            state.orderDetails = action.payload
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },        
    }
})

export default orderScreenSlice

export const orderScreenActions = orderScreenSlice.actions