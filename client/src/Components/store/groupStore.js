/* /cleint/component/store/groupStore.js */

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  groupName: "",
  selectedAdmins: [],
  selectedMembers: [],
  allGroups: [],
  selectedGroups: null,
  messages: [],
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
    setAllGroups: (state, action) => {
      state.allGroups = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    toggleGroup: (state, action) => {
      state.selectedGroups = action.payload;
      console.log('toggleGroups:' ,action.payload);
      localStorage.setItem("group", JSON.stringify(action.payload));
    }
  },
});

export const createGroup = (groupData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

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
    const group =JSON.parse(localStorage.getItem("group"));
    const groupId = group.id;
    const user = JSON.parse(localStorage.getItem("userResData"));
    const userId = user.id;

    const res = await axios.get(`http://localhost:4000/chat/getGroupChatMessages?groupId=${groupId}&userId=${userId}`, {
      headers: { Authorization: token },
    });

    if (Array.isArray(res.data.messages)) {
      const userIds = res.data.messages.map(message => message.userId);

      const userDetailsPromises = userIds.map(async userId => {
        const userDetailsRes = await axios.get(`http://localhost:4000/user/${userId}`);
        return userDetailsRes.data.user.name;
      });

      const userNames = await Promise.all(userDetailsPromises);

      const updatedMessages = res.data.messages.map((message, index) => ({
        ...message,
        userName: userNames[index],
      }));

      dispatch(setMessages(updatedMessages));
    } else {
      console.log("Invalid messages format:", res.data);
    }
  } catch (error) {
    console.log("Error fetching messages:", error);
  }
};


export const {
  toggleMembersSelection,
  toggleAdminSelection,
  setGroupName,
  setAllGroups,
  setMessages,
  selectedGroups,
  toggleGroup,
} = groupSlice.actions;

export default groupSlice.reducer;