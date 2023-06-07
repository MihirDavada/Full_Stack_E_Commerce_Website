import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: false , isError:false , adminUserDetail : { name:'' , email:'', isAdmin:''}}

const adminUserDetailSlice = createSlice({
    name : 'adminUserDetailSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchUserInfoSuccessfully(state, action){
            state.isLoading = false
            state.adminUserDetail = action.payload
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
    }
})

export default adminUserDetailSlice

export const adminUserDetailAction = adminUserDetailSlice.actions