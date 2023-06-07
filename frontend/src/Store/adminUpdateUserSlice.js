import { createSlice } from '@reduxjs/toolkit'

const initialState = {isLoading: false , isError:false , adminUpdatedUser : null, success:false}

const adminUpdateUserSlice = createSlice({
    name : 'adminUpdateUserSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchUserInfoSuccessfully(state, action){
            state.isLoading = false
            state.adminUpdatedUser = action.payload
            state.success = true
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
        resetUser(state, action){
            state.adminUpdatedUser = null
            state.isLoading = false
            state.success = false
        }
    }
})

export default adminUpdateUserSlice

export const adminUpdateUserAction = adminUpdateUserSlice.actions