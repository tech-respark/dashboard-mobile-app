import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface LoadersState {
    isLoading: boolean;
}

const initialState: LoadersState = {
    isLoading: false
}

const loadersSlice = createSlice({
    name: 'isLoading',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<LoadersState>) => {
            console.log("Yaha aaya set isLoadfinb")
            state.isLoading = !state.isLoading;
        },
    }
});

export const {setIsLoading} = loadersSlice.actions;


export const selectIsLoading = (state: RootState) => state.Loaders.isLoading;

export default loadersSlice.reducer;