/* /cleint/component/store/groupStore.js */

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  groupName: "",
  selectedAdmins: [],
  selectedMembers: [],
  allGroups: [],
};

const groupSlice = createSlice({
  name: "groupStoreCreation",
  initialState,
  reducers: {
    toggleMembersSelection: (state, action) => {
      const memberId = action.payload;
      state.selectedMembers = state.selectedMembers.includes(memberId)
        ? state.selectedMembers.filter((id) => id !== memberId)
        : [...state.selectedMembers, memberId];
    },
    toggleAdminSelection: (state, action) => {
      const memberId = action.payload;
      state.selectedAdmins = state.selectedAdmins.includes(memberId)
        ? state.selectedAdmins.filter((id) => id !== memberId)
        : [...state.selectedAdmins, memberId];
    },
    setGroupName: (state, action) => {
      state.groupName = action.payload;
    },
  },
});

export const createGroup = (groupData) =>  async (dispatch) => {

  try {

  // dispatch(createGroup());

  const user = JSON.parse(localStorage.getItem("user"));
   
  const token = localStorage.getItem("token");
  console.log(token);
  const headers = {

      "Content-Type" : "application/json",
      Authorization : token,
  }

  const response = await axios.post("http://localhost:4000/group/makeGroup",{groupData},{headers});

  console.log("Group created successfully : ", response.data);

  }catch(err) {
   
      console.log(err);
      console.log("Error creating group : ",err);

  }
}

export const { 
  toggleMembersSelection, 
  toggleAdminSelection, 
  setGroupName } =
  groupSlice.actions;

export default groupSlice.reducer;
