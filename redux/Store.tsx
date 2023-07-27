import { configureStore } from "@reduxjs/toolkit";
import Loaders from "./state/Loaders";
export const store = configureStore({reducer: {Loaders}});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;