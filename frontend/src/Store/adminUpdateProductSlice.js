import { createSlice } from '@reduxjs/toolkit'

const initialState = {isLoading: false , isError:false , adminUpdatedProduct : null, success:false}

const adminUpdateProductSlice = createSlice({
    name : 'adminUpdateProductSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchProductInfoSuccessfully(state, action){
            state.isLoading = false
            state.adminUpdatedProduct = action.payload
            state.success = true
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
        resetUser(state, action){
            return {}
        }
    }
})

export default adminUpdateProductSlice

export const adminUpdateProductAction = adminUpdateProductSlice.actions