import {
  apiService,
  LoginCredentials,
  SignupCredentials,
} from "@/services/api";
import { AsyncThunkReducers, createAppSlice } from "./utils";
import { AppStartListening } from "../middleware/listener";

interface User {
  id: number;
  email: string;
  username: string;
}

interface UsersState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isEnsuringAuthentication?: true;
}

const initialState: UsersState = {
  currentUser: null,
  loading: false,
  error: null,
};

const makeLoginReducers = (errorMsg: string) =>
  ({
    pending(state) {
      state.loading = true;
      state.error = null;
    },
    fulfilled(state, action) {
      state.currentUser = action.payload.user;
    },
    rejected(state, action) {
      state.error = action.error.message || errorMsg;
      state.currentUser = null;
    },
    settled(state) {
      state.loading = false;
    },
  }) satisfies AsyncThunkReducers<
    UsersState,
    LoginCredentials | SignupCredentials,
    Awaited<ReturnType<typeof apiService.login | typeof apiService.signup>>
  >;

export const usersSlice = createAppSlice({
  name: "users",
  initialState,
  reducers: (create) => ({
    passwordMismatch: create.reducer((state) => {
      state.error = "Passwords do not match";
      state.loading = false;
    }),
    login: create.asyncThunk(
      (credentials: LoginCredentials) => apiService.login(credentials),
      makeLoginReducers("Login failed"),
    ),
    signup: create.asyncThunk(
      (credentials: SignupCredentials) => apiService.signup(credentials),
      makeLoginReducers("Signup failed"),
    ),
    ensureAuthenticated: create.asyncThunk(() => apiService.getCurrentUser(), {
      pending(state) {
        state.isEnsuringAuthentication = true;
      },
      fulfilled(state, action) {
        state.currentUser = action.payload;
      },
      settled(state) {
        delete state.isEnsuringAuthentication;
      },
      options: {
        condition(_, { getState }) {
          // useEffect runs twice, this check prevents duplicate requests
          return !(getState() as { users: UsersState }).users
            .isEnsuringAuthentication;
        },
      },
    }),
    logout: create.asyncThunk(() => apiService.logout(), {
      fulfilled: () => initialState,
    }),
  }),
  selectors: {
    selectCurrentUser: (state) => state.currentUser,
    selectIsAuthenticated: (state) => !!state.currentUser,
  },
});

export const { passwordMismatch, logout, login, signup, ensureAuthenticated } =
  usersSlice.actions;
export const { selectCurrentUser, selectIsAuthenticated } =
  usersSlice.selectors;

export const setupExpiredTokenListener = (
  startAppListening: AppStartListening,
) =>
  startAppListening({
    actionCreator: ensureAuthenticated.rejected,
    effect: (_, { dispatch }) => {
      dispatch(logout());
    },
  });
