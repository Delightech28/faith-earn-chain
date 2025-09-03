import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Auth from "./pages/Auth";
import Bible from "./pages/Bible";
import Wallet from "./pages/Wallet";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import AppPreferences from "./pages/AppPreferences";
import NotificationsPage from "./pages/NotificationsPage";
import DarkModePage from "./pages/DarkModePage";
import LanguagePage from "./pages/LanguagePage";
import PrivacyPage from "./pages/PrivacyPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import Books from "./pages/Books";
import BookChapters from "./pages/BookChapters";
import ReadChapter from "./pages/ReadChapter";
import Favorites from "./pages/Favorites";
import BottomNavigation from "./components/BottomNavigation";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = localStorage.getItem("faithchain_user");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LanguageProvider>
            <FavoritesProvider>
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
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/dark-mode" element={
              <ProtectedRoute>
                <DarkModePage />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/language" element={
              <ProtectedRoute>
                <LanguagePage />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/privacy" element={
              <ProtectedRoute>
                <PrivacyPage />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <AboutPage />
                <BottomNavigation />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
              </Routes>
              </BrowserRouter>
            </FavoritesProvider>
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
