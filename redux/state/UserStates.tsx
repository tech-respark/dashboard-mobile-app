import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface UserStates {
    userData?: {[key: string]: string},
    configs?: {[key: string]: any},
    tenantId?: number,
    StoreIdData?: {[key: string]: any}[]
    availableTabs?: {[key: string]: boolean},
    currentBranch? : string
}

const initialState: UserStates = {
    userData: {},
    configs: {},
    tenantId: 0,
    StoreIdData: [],
    availableTabs: {},
    currentBranch: ""
}

const UserSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserStates>) => {
            console.log("Payload: ", action.payload)
           state.userData = action.payload.userData;
           state.tenantId = action.payload.tenantId;
        },
        setConfig: (state, action: PayloadAction<UserStates>) => {
            state.configs = action.payload.configs;
            state.availableTabs =  action.payload.configs?.storeConfig?.basicConfig ?? {};
        },
        setStoreIdData: (state, action: PayloadAction<UserStates>) => {
            state.StoreIdData = action.payload.StoreIdData;
        },
        setCurrentBranch: (state, action: PayloadAction<UserStates>) => {
            state.currentBranch = action.payload.currentBranch;
        }
    }
});

export const {setUserData, setConfig, setStoreIdData, setCurrentBranch} = UserSlice.actions;


export const selectUserData = (state: RootState) => state.UserStates.userData;
export const selectAvailableConfig = (state: RootState) => state.UserStates.availableTabs;
export const selectTenantId = (state: RootState) => state.UserStates.tenantId;
export const selectStoreData = (state: RootState) => state.UserStates.StoreIdData;
export const selectCurrentBranch = (state: RootState) => state.UserStates.currentBranch;

export const selectConfig = (state: RootState) => state.UserStates.configs;

export default UserSlice.reducer;