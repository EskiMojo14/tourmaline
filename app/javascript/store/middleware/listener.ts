import {
  addListener,
  createListenerMiddleware,
  removeListener,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "@/store";
import { setupExpiredTokenListener } from "../slices/usersSlice";

export const listenerInstance = createListenerMiddleware();

export const startAppListening = listenerInstance.startListening.withTypes<
  RootState,
  AppDispatch,
  undefined
>();

export type AppStartListening = typeof startAppListening;

export const stopAppListening = listenerInstance.stopListening.withTypes<
  RootState,
  AppDispatch,
  undefined
>();

export type AppStopListening = typeof stopAppListening;

export const addAppListener = addListener.withTypes<
  RootState,
  AppDispatch,
  undefined
>();

export type AppAddListener = typeof addAppListener;

export const removeAppListener = removeListener.withTypes<
  RootState,
  AppDispatch,
  undefined
>();

export type AppRemoveListener = typeof removeAppListener;

setupExpiredTokenListener(startAppListening);
