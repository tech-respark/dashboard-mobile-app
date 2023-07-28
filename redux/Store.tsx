import { configureStore } from "@reduxjs/toolkit";
import UIStates from "./state/UIStates";
import UserStates from "./state/UserStates";

export const store = configureStore({reducer: {UIStates, UserStates}});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;