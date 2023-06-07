import { createSlice } from '@reduxjs/toolkit'

const initialState = { isLoading: false , isError:false , newUserInfo : null}

const signUpSlice = createSlice({
    name : 'SignUp',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchUserInfoSuccessfully(state, action){
            state.isLoading = false
            state.newUserInfo = action.payload
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
            
        },        
    }
})


export default signUpSlice

export const signUpAction = signUpSlice.actions