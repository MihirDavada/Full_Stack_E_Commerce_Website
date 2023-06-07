import { createSlice } from '@reduxjs/toolkit'

const userInfoFromLocalStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')): null;

const initialState = { isLoading: false , isError:false , userInfo : userInfoFromLocalStorage}

const authSlice = createSlice({
    name : 'Authentication',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchUserInfoSuccessfully(state, action){
            state.isLoading = false
            state.userInfo = action.payload
            localStorage.setItem("userInfo", JSON.stringify(action.payload))
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
        UserLogOut(state, action){
            state.userInfo = null
            localStorage.removeItem('userInfo')
        }
        
    }
})

export default authSlice

export const authActions = authSlice.actions