import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface UserStates {
    userData: {[key: string]: string}
}

const initialState: UserStates = {
    userData: {}
}

const UserSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserStates>) => {
           state.userData = action.payload.userData;
        },
    }
});

export const {setUserData} = UserSlice.actions;


export const selectUserData = (state: RootState) => state.UserStates.userData;

export default UserSlice.reducer;