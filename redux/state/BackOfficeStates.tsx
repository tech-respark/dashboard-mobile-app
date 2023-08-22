import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface BackOfficeStates {
    categoriesData: { [key: string]: any }[];
}

const initialState: BackOfficeStates = {
    categoriesData: []
}

const BackOfficeSlice = createSlice({
    name: 'BackOffice',
    initialState,
    reducers: {
        setCategoriesData: (state, action: PayloadAction<BackOfficeStates>) => {
           state.categoriesData = action.payload.categoriesData;
        },
    }
});

export const {setCategoriesData} = BackOfficeSlice.actions;


export const selectCategoriesData = (state: RootState) => state.BackOfficeStates.categoriesData;

export default BackOfficeSlice.reducer;