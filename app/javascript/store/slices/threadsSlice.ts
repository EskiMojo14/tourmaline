import { apiService, Thread, Post } from "../../services/api";
import { createAppSlice } from "./utils";

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

const threadsSlice = createAppSlice({
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
      pending(state) {
        state.loading = true;
        state.error = null;
      },
      fulfilled(state, action) {
        state.threads = action.payload;
      },
      rejected(state, action) {
        state.error = action.error.message || "Failed to fetch threads";
      },
      settled(state) {
        state.loading = false;
      },
    }),
    fetchThread: create.asyncThunk((id: number) => apiService.getThread(id), {
      pending(state) {
        state.loading = true;
        state.error = null;
      },
      fulfilled(state, action) {
        state.currentThread = action.payload;
      },
      rejected(state, action) {
        state.error = action.error.message || "Failed to fetch thread";
      },
      settled(state) {
        state.loading = false;
      },
    }),
    createThread: create.asyncThunk(
      (data: { title: string; content: string }) =>
        apiService.createThread(data),
      {
        pending(state) {
          state.loading = true;
          state.error = null;
        },
        fulfilled(state, action) {
          state.threads.unshift(action.payload);
        },
        rejected(state, action) {
          state.error = action.error.message || "Failed to create thread";
        },
        settled(state) {
          state.loading = false;
        },
      },
    ),
    createPost: create.asyncThunk(
      ({ threadId, content }: { threadId: number; content: string }) =>
        apiService.createPost(threadId, content),
      {
        pending(state) {
          state.loading = true;
          state.error = null;
        },
        fulfilled(state, action) {
          if (state.currentThread) {
            if (!state.currentThread.posts) {
              state.currentThread.posts = [];
            }
            state.currentThread.posts.push(action.payload);
          }
        },
        rejected(state, action) {
          state.error = action.error.message || "Failed to create post";
        },
        settled(state) {
          state.loading = false;
        },
      },
    ),
  }),
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
export default threadsSlice.reducer;
