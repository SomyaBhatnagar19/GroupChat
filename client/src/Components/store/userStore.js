/* /cleint/component/store/userStore.js */

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
 
    allUsers: [],
}

const userSlice = createSlice({
    name: "userCreation",
    initialState,
    reducers: {
        setUsers: (state, action) => {
         state.allUsers = action.payload
        }
    }
}
)

export const fetchAllUsers = () => async(dispatch) => {
    try {
        const response = await axios.get('http://localhost:4000/group/getAllUsers');
        dispatch(setUsers(response.data.users));
        console.log(response.data.users);

    } catch (err) {
        console.log("Error fetching all users:", err);
    }
} 
    
export const { setUsers } = userSlice.actions;

export default userSlice.reducer;