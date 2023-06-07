import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: false , isError:false , user : null}

const userProfileSlice = createSlice({
    name : 'userProfile',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchUserInfoSuccessfully(state, action){
            state.isLoading = false
            state.user = action.payload
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
        logOutHandler(state, action){
            state.user = null
        }        
    }
})

export default userProfileSlice

export const userProfileAction = userProfileSlice.actions