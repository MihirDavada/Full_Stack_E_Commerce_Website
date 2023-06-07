import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: false , isError:false , productDetailsById : []}

const productDetailsByIdSlice = createSlice({
    name : 'productDetailsById',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchProductDetailSuccessfully(state,action){
            state.isLoading = false
            state.productDetailsById = action.payload
        },
        setTheError(state, action){
            state.isError = true
        }
    }
})

export default productDetailsByIdSlice

export const productDetailsByIdActions = productDetailsByIdSlice.actions