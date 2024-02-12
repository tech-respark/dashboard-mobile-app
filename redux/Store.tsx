import { configureStore } from "@reduxjs/toolkit";
import UIStates from "./state/UIStates";
import UserStates from "./state/UserStates";
import BackOfficeStates from "./state/BackOfficeStates";
import AppointmentStates from "./state/AppointmentStates";

export const store = configureStore({
    reducer: {UIStates, UserStates, BackOfficeStates, AppointmentStates},
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;