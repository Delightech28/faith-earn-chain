import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Bible from "./pages/Bible";
import Wallet from "./pages/Wallet";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import AppPreferences from "./pages/AppPreferences";
import NotFound from "./pages/NotFound";
import Books from "./pages/Books";
import BookChapters from "./pages/BookChapters";
import ReadChapter from "./pages/ReadChapter";
import BottomNavigation from "./components/BottomNavigation";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = localStorage.getItem("faithchain_user");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/bible" element={
              <ProtectedRoute>
                <Bible />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/books" element={
              <ProtectedRoute>
                <Books />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/books/:bookName" element={
              <ProtectedRoute>
                <BookChapters />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/read/:book/:chapter" element={
              <ProtectedRoute>
                <ReadChapter />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/wallet" element={
              <ProtectedRoute>
                <Wallet />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/edit-profile" element={
              <ProtectedRoute>
                <EditProfile />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/app-preferences" element={
              <ProtectedRoute>
                <AppPreferences />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
