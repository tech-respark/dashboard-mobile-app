import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface UIStates {
    isLoading?: boolean;
    showBackOfficeCategories?: boolean;
    showUserProfileTopBar?: boolean;
}

const initialState: UIStates = {
    isLoading: false,
    showBackOfficeCategories: true,
    showUserProfileTopBar: true,
}

const UISlice = createSlice({
    name: 'UIStates',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<UIStates>) => {
           state.isLoading = !state.isLoading;
        },
        setShowBackOfficeCategories: (state) => {
            state.showBackOfficeCategories = !state.showBackOfficeCategories;
        },
        setShowUserProfileTopBar: (state) => {
            state.showUserProfileTopBar = !state.showUserProfileTopBar;
        }
    }
});

export const {setIsLoading, setShowBackOfficeCategories, setShowUserProfileTopBar} = UISlice.actions;


export const selectIsLoading = (state: RootState) => state.UIStates.isLoading;
export const selectShowBackOfficeCategories = (state: RootState) => state.UIStates.showBackOfficeCategories;
export const selectShowUserProfileTopBar = (state: RootState) => state.UIStates.showUserProfileTopBar;

export default UISlice.reducer;