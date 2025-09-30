import {createSlice,}  from '@reduxjs/toolkit'

//initial state
const initialState = {
    user:null,
    token:''
};


// userSlice
const UserSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser : (state,action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
        } ,
        logoutUser : (state)=>{
             state.user = null;
            state.token = '';
        }
    }
});

export const {setUser , logoutUser} = UserSlice.actions
export default UserSlice.reducer;