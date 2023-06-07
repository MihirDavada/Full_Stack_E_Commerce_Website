import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: false , isError:false , success:false, paymentResponse:null }

const orderPaySlice = createSlice({
    name : 'OrderPay',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchOrderPayDetailfully(state, action){
            state.isLoading = false
            state.success = true
            state.paymentResponse = action.payload
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
        resetThePay(state, action){
            state.success = false
            state.paymentResponse = null
            state.isError = false
            state.isLoading = false
        }        
    }
})

export default orderPaySlice

export const orderPayActions = orderPaySlice.actions