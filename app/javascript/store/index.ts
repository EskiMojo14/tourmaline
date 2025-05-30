import { configureStore } from "@reduxjs/toolkit";
import threadsReducer from "./slices/threadsSlice";
import usersReducer from "./slices/usersSlice";

export const store = configureStore({
  reducer: {
    threads: threadsReducer,
    users: usersReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
