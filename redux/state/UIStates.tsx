import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface UIStates {
    isLoading: boolean;
}

const initialState: UIStates = {
    isLoading: false
}

const UISlice = createSlice({
    name: 'isLoading',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<UIStates>) => {
           state.isLoading = !state.isLoading;
        },
    }
});

export const {setIsLoading} = UISlice.actions;


export const selectIsLoading = (state: RootState) => state.UIStates.isLoading;

export default UISlice.reducer;