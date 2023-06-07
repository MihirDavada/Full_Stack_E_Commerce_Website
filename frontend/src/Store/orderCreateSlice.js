import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: false , isError:false , order: {}, success:false}

const orderCreateSlice = createSlice({
    name : 'orderCreate',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchOrderSuccessfully(state, action){
            state.isLoading = false
            state.order = action.payload
            state.success = true
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
        resetTheOrder(state, action){
            state.isLoading = false
            state.success = false
            state.order = {}

        }        
    }
})

export default orderCreateSlice

export const orderCreateActions = orderCreateSlice.actions