/* /cleint/component/store/index.js */

import { configureStore } from "@reduxjs/toolkit";

import userCreationReducer from './userStore';
import groupCreationReducer from './groupStore';

const store = configureStore({
    reducer: {
        userCreation: userCreationReducer,
        groupStoreCreation: groupCreationReducer,
    }
})

export default store;

