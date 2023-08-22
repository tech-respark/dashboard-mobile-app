import { configureStore } from "@reduxjs/toolkit";
import UIStates from "./state/UIStates";
import UserStates from "./state/UserStates";
import BackOfficeStates from "./state/BackOfficeStates";

export const store = configureStore({reducer: {UIStates, UserStates, BackOfficeStates}});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;