import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { AppPreloadedState, AppStore, makeStore } from "@/store";

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: AppPreloadedState;
  store?: AppStore;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState,
    store = makeStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {},
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Mock user data
export const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
};

// Mock thread data
export const mockThread = {
  id: 1,
  title: "Test Thread",
  content: "This is a test thread content.",
  user_id: 1,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  posts_count: 2,
  user: mockUser,
};

// Mock post data
export const mockPost = {
  id: 1,
  content: "This is a test post.",
  user_id: 1,
  thread_id: 1,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  user: mockUser,
};

// Mock API responses
export const mockApiResponse = (data: unknown, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as Response);
};
