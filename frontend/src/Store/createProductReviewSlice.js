import { createSlice } from '@reduxjs/toolkit'

const initialState = {isLoading: false , isError:false , success:false}

const createProductReviewSlice = createSlice({
    name : 'createProductReviewSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
            state.success = false
        },
        createProductReviewSuccessfully(state, action){
            state.isLoading = false
            state.success = true
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
            state.success = false
        },
        reset(state, action){
            state.isLoading = false
            state.isError = false
            state.success = false
        },
    }
})

export default createProductReviewSlice

export const createProductReviewAction = createProductReviewSlice.actions