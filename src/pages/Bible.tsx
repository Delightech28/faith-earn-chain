import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { BookOpen, FileText, Search, Heart, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReadingTimeTracker } from "@/hooks/useReadingTimeTracker";
import ReadingTimeCounter from "@/components/ReadingTimeCounter";


const Bible = () => {
  const isMobile = useMediaQuery({ maxWidth: 600 });
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { t } = useLanguage();
  useReadingTimeTracker(); // Start tracking reading time

  const handleCardClick = (label: string) => {
    if (label === "All Books") navigate("/books");
    if (label === "Favourite") navigate("/favorites");
    // Add other navigation logic as needed
  };
  // Redirect or block desktop view
  if (!isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Mobile Only</h2>
          <p className="text-muted-foreground">This page is only accessible on mobile devices.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0b0b] to-[#fff] p-0 pb-20">
      {/* Reading Time Counter */}
      <div className="fixed top-4 right-4 z-50">
        <ReadingTimeCounter />
      </div>
      
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="rounded-xl bg-gradient-to-r from-[#a91d1d] to-[#d43f3f] p-6 text-white min-h-[110px] flex flex-col justify-center">
          <div className="font-semibold text-xl">Hello, Good Night,</div>
          <div className="text-base mt-2">The Bible is a manual for life; read it to understand the Creator's instructions.</div>
        </div>
      </div>
      {/* Grid Menu */}
      <div className="px-4 mt-2">
        <div className="grid grid-cols-3 gap-4">
          <div
            className="flex flex-col items-center justify-center py-8 rounded-lg bg-white shadow-sm cursor-pointer min-h-[110px]"
            onClick={() => handleCardClick("All Books")}
          >
            <BookOpen className="w-7 h-7 text-red-500 mb-2" />
            <span className="text-xs font-semibold text-gray-700">All Books</span>
          </div>
          
          <div className="flex flex-col items-center justify-center py-8 rounded-lg bg-white shadow-sm cursor-pointer min-h-[110px]">
            <FileText className="w-7 h-7 text-red-500 mb-2" />
            <span className="text-xs font-semibold text-gray-700">Notes</span>
          </div>
          
          <div className="flex flex-col items-center justify-center py-8 rounded-lg bg-white shadow-sm cursor-pointer min-h-[110px]">
            <Search className="w-7 h-7 text-red-500 mb-2" />
            <span className="text-xs font-semibold text-gray-700">Search</span>
          </div>
          
          <div
            className="flex flex-col items-center justify-center py-8 rounded-lg bg-white shadow-sm cursor-pointer min-h-[110px] relative"
            onClick={() => handleCardClick("Favourite")}
          >
            <Heart className="w-7 h-7 text-red-500 mb-2" />
            <span className="text-xs font-semibold text-gray-700">Favourite</span>
            {favorites.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {favorites.length}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center py-8 rounded-lg bg-white shadow-sm cursor-pointer min-h-[110px]">
            <MessageSquare className="w-7 h-7 text-red-500 mb-2" />
            <span className="text-xs font-semibold text-gray-700">Feedback</span>
          </div>
        </div>
      </div>
      {/* Verse of the Day */}
      <div className="px-4 mt-6">
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="font-bold text-center text-lg mb-2">Verse Of the Day</div>
          <div className="text-center text-sm mb-2">
            "The Lord is my strength and my defense; he has become my salvation. He is my God, and I will praise him, my father's God, and I will exalt him."
          </div>
          <div className="text-center text-xs text-red-500 font-semibold">Exodus 15 : 2</div>
        </div>
      </div>
    </div>
  );
};

export default Bible;