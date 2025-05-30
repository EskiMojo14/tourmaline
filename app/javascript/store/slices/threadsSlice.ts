import { apiService, Thread, Post } from "../../services/api";
import { AsyncThunkReducers, createAppSlice } from "./utils";

interface ThreadWithPosts extends Thread {
  posts?: Post[];
}

export interface ThreadsState {
  threads: Thread[];
  currentThread: ThreadWithPosts | null;
  loading: boolean;
  error: string | null;
}

const initialState: ThreadsState = {
  threads: [],
  currentThread: null,
  loading: false,
  error: null,
};

const makeStatusReducers = (errorMsg: string) =>
  ({
    pending(state) {
      state.loading = true;
      state.error = null;
    },
    rejected(state, action) {
      state.error = action.error.message || errorMsg;
    },
    settled(state) {
      state.loading = false;
    },
  }) satisfies AsyncThunkReducers<ThreadsState, unknown>;

export const threadsSlice = createAppSlice({
  name: "threads",
  initialState,
  reducers: (create) => ({
    clearCurrentThread: create.reducer((state) => {
      state.currentThread = null;
    }),
    clearError: create.reducer((state) => {
      state.error = null;
    }),
    upsertThread: create.reducer<Thread>((state, action) => {
      // Remove if exists, then unshift (add to top)
      state.threads = state.threads.filter((t) => t.id !== action.payload.id);
      state.threads.unshift(action.payload);
    }),
    addPostToCurrentThread: create.reducer<Post>((state, action) => {
      if (state.currentThread) {
        if (!state.currentThread.posts) state.currentThread.posts = [];
        state.currentThread.posts.push(action.payload);
      }
    }),
    fetchThreads: create.asyncThunk(() => apiService.getThreads(), {
      ...makeStatusReducers("Failed to fetch threads"),
      fulfilled(state, action) {
        state.threads = action.payload;
      },
    }),
    fetchThread: create.asyncThunk((id: number) => apiService.getThread(id), {
      ...makeStatusReducers("Failed to fetch thread"),
      fulfilled(state, action) {
        state.currentThread = action.payload;
      },
    }),
    createThread: create.asyncThunk(
      (data: { title: string; content: string }) =>
        apiService.createThread(data),
      {
        ...makeStatusReducers("Failed to create thread"),
        fulfilled(state, action) {
          state.threads.unshift(action.payload);
        },
      },
    ),
    createPost: create.asyncThunk(
      ({ threadId, content }: { threadId: number; content: string }) =>
        apiService.createPost(threadId, content),
      {
        ...makeStatusReducers("Failed to create post"),
        fulfilled(state, action) {
          if (state.currentThread) {
            (state.currentThread.posts ??= []).push(action.payload);
          }
        },
      },
    ),
  }),
  selectors: {
    selectThreads: (state) => state.threads,
    selectCurrentThread: (state) => state.currentThread,
    selectIsLoading: (state) => state.loading,
    selectError: (state) => state.error,
  },
});

export const {
  clearCurrentThread,
  clearError,
  upsertThread,
  addPostToCurrentThread,
  fetchThreads,
  fetchThread,
  createThread,
  createPost,
} = threadsSlice.actions;
export const {
  selectThreads,
  selectCurrentThread,
  selectIsLoading,
  selectError,
} = threadsSlice.selectors;
