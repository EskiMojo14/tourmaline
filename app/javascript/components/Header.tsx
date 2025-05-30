import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import AuthModal from "./AuthModal";
import { apiService } from "../services/api";
import {
  logout,
  ensureAuthenticated,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        dispatch(ensureAuthenticated());
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(logout());
  };

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tourmaline-text">tourmaline</h1>
            <p className="text-sm text-muted-foreground">
              dynamic async realtime discussions
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {currentUser.username}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)}>
                Login / Sign Up
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default Header;
