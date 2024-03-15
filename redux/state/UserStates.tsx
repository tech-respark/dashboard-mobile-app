import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface UserStates {
    userData?: { [key: string]: string },
    configs?: { [key: string]: any },
    tenantId?: number,
    storeIdData?: { [key: string]: any }[],
    availableTabs?: { [key: string]: boolean },
    currentBranch?: string,
    storeID?: number,
    staffData?: { [key: string]: any }[],
    currentStoreConfig?: {[key: string]: any},
    storeCount?: number,
    productServiceCategories?: { [key: string]: any }[],
    paymentTypes?: { [key: string]: any }[],
    smsConfig?: { [key: string]: any },
}

const initialState: UserStates = {
    userData: {},
    configs: {},
    tenantId: 0,
    storeIdData: [],
    availableTabs: {},
    currentBranch: "",
    storeID: 0,
    staffData: [],
    currentStoreConfig: {},
    storeCount: 0,
    productServiceCategories: [],
    paymentTypes: [],
    smsConfig: {}
}

const UserSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserStates>) => {
            state.userData = action.payload.userData;
            state.tenantId = action.payload.tenantId;
        },
        setConfig: (state, action: PayloadAction<UserStates>) => {
            state.configs = action.payload.configs;
            state.availableTabs = action.payload.configs?.storeConfig?.basicConfig ?? {};
        },
        setStoreIdData: (state, action: PayloadAction<UserStates>) => {
            state.storeIdData = action.payload.storeIdData;
        },
        setCurrentBranch: (state, action: PayloadAction<UserStates>) => {
            state.currentBranch = action.payload.currentBranch;
            let storeData = state.storeIdData?.find(item => item.name === action.payload.currentBranch);
            state.storeID = storeData ? storeData.id : 0;
        },
        setStaffData : (state, action: PayloadAction<UserStates>) => {
            let staffData = action.payload.staffData;
            staffData!.forEach((staff) => {
                staff.name = `${staff.firstName} ${staff.lastName}`;
            });
            state.staffData = staffData;
        },
        setCurrrentStoreConfig : (state, action: PayloadAction<UserStates>) => {
            state.currentStoreConfig = action.payload.currentStoreConfig;
        },
        setStoreCount: (state, action: PayloadAction<UserStates>) => {
            state.storeCount = action.payload.storeCount;
        },
        setProductServiceCategories: (state, action: PayloadAction<UserStates>) => {
            state.productServiceCategories = action.payload.productServiceCategories;
        },
        setPaymentTypes: (state, action: PayloadAction<UserStates>) => {
            state.paymentTypes = action.payload.paymentTypes;
        },
        setSMSConfig: (state, action: PayloadAction<UserStates>) => {
            state.smsConfig = action.payload.smsConfig;
        },
    },
});

export const { setUserData, setConfig, setStoreIdData, setCurrentBranch, setStaffData, setCurrrentStoreConfig, setStoreCount, setProductServiceCategories, setPaymentTypes, setSMSConfig } = UserSlice.actions;


export const selectUserData = (state: RootState) => state.UserStates.userData;
export const selectAvailableConfig = (state: RootState) => state.UserStates.availableTabs;
export const selectTenantId = (state: RootState) => state.UserStates.tenantId;
export const selectStoreData = (state: RootState) => state.UserStates.storeIdData;
export const selectCurrentBranch = (state: RootState) => state.UserStates.currentBranch;
export const selectBranchId = (state: RootState) => state.UserStates.storeID;
export const selectStaffData = (state: RootState) => state.UserStates.staffData;
export const selectCurrentStoreConfig = (state: RootState) => state.UserStates.currentStoreConfig;
export const selectConfig = (state: RootState) => state.UserStates.configs;
export const selectStoreCount = (state: RootState) => state.UserStates.storeCount;
export const selectProductServiceCategories = (state: RootState) => state.UserStates.productServiceCategories;
export const selectPaymentTypes = (state: RootState) => state.UserStates.paymentTypes;
export const selectSMSConfig = (state: RootState) => state.UserStates.smsConfig;



export default UserSlice.reducer;