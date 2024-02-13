import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface AppointmentStates {
    segments?: {[key: string]: {[key: string]: any}[]},
    sources?: { [key: string]: any }[],
}

const initialState: AppointmentStates = {
    segments: {},
    sources: [],
}

const AppointmentSlice = createSlice({
    name: 'AppointmentSlice',
    initialState,
    reducers: {
        setSegments: (state, action: PayloadAction<AppointmentStates>) => {
           state.segments = action.payload.segments;
        },
        setCustomerSources: (state, action: PayloadAction<AppointmentStates>) => {
            state.sources = action.payload.sources;
        },
    }
});

export const {setSegments, setCustomerSources} = AppointmentSlice.actions;

export const selectSegments = (state: RootState) => state.AppointmentStates.segments;
export const selectCustomerSources = (state: RootState) => state.AppointmentStates.sources;

export default AppointmentSlice.reducer;