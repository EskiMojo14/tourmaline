import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { listenerInstance } from "./middleware/listener";
import { apiService } from "@/services/api";
import { threadsSlice } from "./slices/threadsSlice";
import { usersSlice } from "./slices/usersSlice";

const extraArgument = { apiService };
export type AppExtra = typeof extraArgument;

export const rootReducer = combineSlices(threadsSlice, usersSlice);

export type AppPreloadedState = Parameters<typeof rootReducer>[0];

export function makeStore(preloadedState?: AppPreloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument },
      }).concat(listenerInstance.middleware),
  });
}

export const store = makeStore();

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
