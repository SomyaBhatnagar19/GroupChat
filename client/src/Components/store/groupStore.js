/* /cleint/component/store/groupStore.js */

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  groupName: "",
  selectedAdmins: JSON.parse(localStorage.getItem('userResData'))?.id ? [JSON.parse(localStorage.getItem('userResData')).id] : [],
  selectedMembers: [],
  selectTheUsersFromGroup : [],
  allGroups: [],
  selectedGroups: null,
  allNewMembers: [],
  allNewAdmins : [],
  allTheUsersInGroup : [],
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
    toggleAllMemberSelectionInGroup : (state,action) => {

      const memberId = action.payload;
      state.selectTheUsersFromGroup = state.selectTheUsersFromGroup.includes(memberId) ? 
      state.selectTheUsersFromGroup.filter((id)=>id !==memberId) : [...state.selectTheUsersFromGroup,memberId];

    },
    setSelectedAdmins : (state,action) => {
      state.selectedAdmins.push(action.payload);
  },
  deselectAdmin : (state,action) => {
      state.selectedAdmins =  state.selectedAdmins.filter(
          (adminId) => adminId !== action.payload
      );
  },
    setGroupName: (state, action) => {
      state.groupName = action.payload;
    },
    setAllGroups: (state, action) => {
      state.allGroups = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    toggleGroup: (state, action) => {
      state.selectedGroups = action.payload;
      console.log("toggleGroups:", action.payload);
      localStorage.setItem("group", JSON.stringify(action.payload));
    },
    setAllNewMembers: (state, action) => {
      state.allNewMembers = action.payload;
    },
    setAllNewAdmins : (state,action) => {
      state.allNewAdmins  = action.payload
    },
    setAllTheUsersInGroup : (state,action) => {
      state.allTheUsersInGroup = action.payload
    },
  },
});

export const createGroup = (groupData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    console.log('Group Data: ', groupData)
    const response = await axios.post(
      "http://localhost:4000/group/makeGroup",
      { groupData },
      { headers }
    );

    console.log("Group created successfully : ", response.data);
  } catch (err) {
    console.log("Error creating group : ", err);
  }
};

export const getAllGroups = () => async (dispatch) => {
  try {
    const user = JSON.parse(localStorage.getItem("userResData"));
    const userId = user.id;

    const response = await axios.get(
      `http://localhost:4000/group/getAllGroups/${userId}`
    );

    dispatch(setAllGroups(response.data.groups));
    // dispatch(fetchMessages());
  } catch (err) {
    console.log("Error fetching the users : ", err);
  }
};

export const fetchMessages = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const group = JSON.parse(localStorage.getItem("group"));
    const groupId = group.id;
    const user = JSON.parse(localStorage.getItem("userResData"));
    const userId = user.id;

    const res = await axios.get(
      `http://localhost:4000/chat/getGroupChatMessages?groupId=${groupId}&userId=${userId}`,
      {
        headers: { Authorization: token },
      }
    );

    if (Array.isArray(res.data.messages)) {
      const userIds = res.data.messages.map((message) => message.userId);

      const userDetailsPromises = userIds.map(async (userId) => {
        try {
          const userDetailsRes = await axios.get(
            `http://localhost:4000/user/${userId}`
          );
          return userDetailsRes.data.user.name;
        } catch (error) {
          console.log(
            `Error fetching user details for user ID ${userId}:`,
            error
          );
          return null; // Return null if user details fetch fails
        }
      });

      const userNames = await Promise.all(userDetailsPromises);

      const updatedMessages = res.data.messages.map((message, index) => ({
        ...message,
        userName: userNames[index] || "Unknown User",
      }));

      dispatch(setMessages(updatedMessages));
    } else {
      console.log("Invalid messages format:", res.data);
    }
  } catch (error) {
    console.log("Error fetching messages:", error);
  }
};

export const sendGroupChatMessages = (groupId, message) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:4000/chat/sendGroupChatMessage/${groupId}`,
      {
        groupId: groupId,
        message: message,
      },
      {
        headers: { Authorization: token },
      }
    );
    dispatch(fetchMessages(groupId));
  } catch (error) {
    console.log("Error sending message:", error);
  }
};

export const addUserToGroup = (groupId, userId) => async (dispatch) => {
  try {
    await axios.post("http://localhost:4000/group/addUserToGroup", {
      groupId,
      userId,
    });
    dispatch(fetchMessages(groupId));
  } catch (error) {
    console.error("Error adding user to group:", error);
  }
};

export const makeMemberAdmin = (groupId, userId) => async (dispatch) => {
  try {
    await axios.put("http://localhost:4000/group/makeMemberAdmin", {
      groupId,
      userId,
    });
    dispatch(fetchMessages(groupId)); // Fetch updated messages after making member admin
  } catch (error) {
    console.error("Error making member admin:", error);
  }
};

export const removeUserFromGroup = (groupId, userId) => async (dispatch) => {
  try {
    await axios.delete(
      `http://localhost:4000/group/removeUserFromGroup/${groupId}/${userId}`
    );
    dispatch(fetchMessages(groupId)); // Fetch updated messages after removing user
  } catch (error) {
    console.error("Error removing user from group:", error);
  }
};

export const getAllNewMembersToAdd = () => async (dispatch) => {
  try {
    const group = JSON.parse(localStorage.getItem("group"));

    const groupId = group.id;

    const response = await axios.get(
      `http://localhost:4000/connection/getAllNewMembers/${groupId}`
    );

    dispatch(setAllNewMembers(response.data.newMembersToAdd));
  } catch (err) {
    console.log("Err occured while fetching new members : ", err);
  }
};

export const getAllNewAdminsToAdd = () => async (dispatch, getState) => {
  try {
    const group = JSON.parse(localStorage.getItem("group"));

    const groupId = group.id;

    const response = await axios.get(
      `http://localhost:4000/connection/getAllAdminsToAdd/${groupId}`
    );

    const arr1 = response.data.newAdminsToAdd;

    console.log("Arr1 is : ", arr1);

    // const arr2 = getState().groupStoreCreation.allNewMembers;

    // console.log("Arr2 is : ", arr2);

    // const arr = [...arr1, ...arr2];

    // console.log("arr is :", arr);

    dispatch(setAllNewAdmins(arr1));

  } catch (err) {}
};

export const addNewMembersToTheGroup = (newMembersData) => async (dispatch) => {

  try {
  
    
    const user = JSON.stringify(localStorage.getItem("user"));
  
    const token = user.token;
  
    const headers = {
  
        "Content-Type" : "application/json",
        Authorization : token,
    }
  
    const response = await axios.post("http://localhost:4000/connection/addNewUsersToUserGroups",{newMembersData},{headers});
  
    console.log("Group created successfully : ", response.data);
  
  
  } catch (err) {
      
    console.log(err);
    console.log("Error creating group : ",err);
  
  }
  
  }

  export const addNewAdminToTheGroup = (newMembersData) => async (dispatch) => {

    try {
    
      
      const user = JSON.stringify(localStorage.getItem("user"));
    
      const token = user.token;
    
      const headers = {
    
          "Content-Type" : "application/json",
          Authorization : token,
      }
    
      const response = await axios.post("http://localhost:4000/connection/addNewAdminToTheGroup",{newMembersData},{headers});
    
      console.log("Group created successfully : ", response.data);
    
    
    } catch (err) {
        
      console.log(err);
      console.log("Error creating group : ",err);
    
    }
    
    }

    export const getAllTheuSersInGroup = () => async (dispatch) => {

      try {
      
        const group = JSON.parse(localStorage.getItem("group"));
              
        const groupId = group.id;
      
        const response = await axios.get(`http://localhost:4000/connection/getAllTheUsersInGroup/${groupId}`);
      
        dispatch(setAllTheUsersInGroup(response.data.allTheUsersInGroup));
      
      }
      catch (err) {
       console.log("Err occured while fetching allTheUsersInGroup : ",err);
      }
      
      };

      export const removeMembersFromTheGroup = (selectedUserDataFromGroup ) => async (dispatch) => {

        try {
        
          const user = JSON.stringify(localStorage.getItem("user"));
      
          const token = user.token;
      
          const headers = {
      
              "Content-Type" : "application/json",
              Authorization : token,
          }
      
          const response = await axios.post("http://localhost:4000/connection/removeUserFromTheGroup",{selectedUserDataFromGroup},{headers});
      
          console.log("Removed Members Successfully : ", response.data);
      
        } catch(err) {
           console.log("Failed to Remove Member from the Group ",err);
        }
      
      }

export const {
  toggleMembersSelection,
  toggleAdminSelection,
  setGroupName,
  setAllGroups,
  setMessages,
  selectedGroups,
  toggleGroup,
  setAllNewMembers,
  setAllNewAdmins,
  setSelectedAdmins,
  deselectAdmin,
  setAllTheUsersInGroup,
  toggleAllMemberSelectionInGroup
} = groupSlice.actions;

export default groupSlice.reducer;
