import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface UIStates {
    isLoading?: boolean;
    showBackOfficeCategories?: boolean;
}

const initialState: UIStates = {
    isLoading: false,
    showBackOfficeCategories: true,
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
        }
    }
});

export const {setIsLoading, setShowBackOfficeCategories} = UISlice.actions;


export const selectIsLoading = (state: RootState) => state.UIStates.isLoading;
export const selectShowBackOfficeCategories = (state: RootState) => state.UIStates.showBackOfficeCategories;

export default UISlice.reducer;