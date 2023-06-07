import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: false , isError:false , myOrders:[]}

const myOrderSlice = createSlice({
    name : 'myOrder',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchMyOrdersDetailfully(state, action){
            state.isLoading = false
            state.myOrders = action.payload
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
        resetTheOrders(state, action){
            state.isError = false
            state.isLoading = false
            state.myOrders = []
        }        
    }
})

export default myOrderSlice

export const myOrderActions = myOrderSlice.actions