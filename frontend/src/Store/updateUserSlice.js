import { createSlice } from '@reduxjs/toolkit'

const initialState = {isLoading: false , isError:false , updatedUser : null, success:false}

const updateUserSlice = createSlice({
    name : 'UpdateUserSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchUserInfoSuccessfully(state, action){
            state.isLoading = false
            state.updatedUser = action.payload
            state.success = true
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
        resetUser(state, action){
            state.updatedUser = null
            state.isLoading = false
            state.success = false
        }
    }
})

export default updateUserSlice

export const updateUserAction = updateUserSlice.actions