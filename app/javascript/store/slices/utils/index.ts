import {
  asyncThunkCreator,
  buildCreateSlice,
  CaseReducer,
  AsyncThunk,
} from "@reduxjs/toolkit";

export const createAppSlice = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator,
  },
});

export type AsyncThunkReducers<
  State,
  ThunkArg,
  Returned = unknown,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ThunkApiConfig extends {} = {},
> = {
  pending?: CaseReducer<
    State,
    ReturnType<AsyncThunk<Returned, ThunkArg, ThunkApiConfig>["pending"]>
  >;
  rejected?: CaseReducer<
    State,
    ReturnType<AsyncThunk<Returned, ThunkArg, ThunkApiConfig>["rejected"]>
  >;
  fulfilled?: CaseReducer<
    State,
    ReturnType<AsyncThunk<Returned, ThunkArg, ThunkApiConfig>["fulfilled"]>
  >;
  settled?: CaseReducer<
    State,
    ReturnType<
      AsyncThunk<Returned, ThunkArg, ThunkApiConfig>["rejected" | "fulfilled"]
    >
  >;
};
