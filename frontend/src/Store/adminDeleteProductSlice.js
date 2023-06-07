import { createSlice } from '@reduxjs/toolkit'

const initialState = {isLoading: false , isError:false , success:false}

const adminDeleteProductSlice = createSlice({
    name : 'adminDeleteProductSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
            state.success = false
        },
        DeleteProductSuccessfully(state, action){
            state.isLoading = false
            state.success = true
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
            state.success = false
        },
    }
})

export default adminDeleteProductSlice

export const adminDeleteProductAction = adminDeleteProductSlice.actions