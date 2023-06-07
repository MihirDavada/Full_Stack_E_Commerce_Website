import { createSlice } from '@reduxjs/toolkit'

const initialState = {isLoading: false , isError:false , success:false}

const userDeleteSlice = createSlice({
    name : 'userDeleteSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
            state.success = false
        },
        DeleteUsersSuccessfully(state, action){
            state.isLoading = false
            state.success = true
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
    }
})

export default userDeleteSlice

export const userDeleteAction = userDeleteSlice.actions