import { createSlice } from '@reduxjs/toolkit'

const initialState = {isLoading: false , isError:false , users : [], success:false}

const userListSlice = createSlice({
    name : 'userListSlice',
    initialState : initialState,
    reducers:{
        sendingRequest(state, action){
            state.isLoading = true
        },
        fetchUsersSuccessfully(state, action){
            state.isLoading = false
            state.users = action.payload
            state.success = true
        },
        setTheError(state, action){
            state.isLoading = false
            state.isError = true
        },
        resetUser(state, action){
            state.users = []
            state.isLoading = false
            state.success = false
        }
    }
})

export default userListSlice

export const userListAction = userListSlice.actions