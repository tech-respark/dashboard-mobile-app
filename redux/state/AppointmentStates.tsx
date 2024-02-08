import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface AppointmentStates {
    segments: {[key: string]: {[key: string]: any}[]},
}

const initialState: AppointmentStates = {
    segments: {}
}

const AppointmentSlice = createSlice({
    name: 'AppointmentSlice',
    initialState,
    reducers: {
        setSegments: (state, action: PayloadAction<AppointmentStates>) => {
           state.segments = action.payload.segments;
        },
    }
});

export const {setSegments} = AppointmentSlice.actions;


export const selectSegments = (state: RootState) => state.AppointmentStates.segments;

export default AppointmentSlice.reducer;