import { createSlice } from '@reduxjs/toolkit'

const initialState = {isLoading: false , isError:false , adminCreatedProduct : {}, success:false}

const adminCreatedProductSlice = createSlice({
    name : 'adminCreatedProductSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchCreatedProductSuccessfully(state, action){
            state.isLoading = false
            state.adminCreatedProduct = action.payload
            state.success = true
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
            state.success = false
        },
        resetUser(state, action){
            return {}
        }
    }
})

export default adminCreatedProductSlice

export const adminCreatedProductAction = adminCreatedProductSlice.actions