import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: false , isError:false , products : [], productDetail : []}


const productSlice = createSlice({
    name : 'Product',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchProductSuccessfully(state, action){
            state.isLoading = false
            state.products = action.payload
        },
        fetchProductDetailSuccessfully(state,action){
            state.isLoading = false
            state.productDetail = action.payload
        },
        setTheError(state, action){
            state.isError = true
        }
    }
})

export default productSlice

export const productActions = productSlice.actions