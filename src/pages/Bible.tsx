import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { BookOpen, FileText, Search, Heart, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReadingTimeTracker } from "@/hooks/useReadingTimeTracker";
import ReadingTimeCounter from "@/components/ReadingTimeCounter";
import { useTheme } from "@/contexts/ThemeContext";



const Bible = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { getCurrentReadingTime } = useReadingTimeTracker();

  // User stats state
  const [userStats, setUserStats] = useState({
    tokens: 0,
    booksRead: 0,
    dayStreak: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch user stats from Firestore
  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) {
        setLoadingStats(false);
        return;
      }
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserStats({
          tokens: data.tokensEarned || 0,
          booksRead: data.booksRead || 0,
          dayStreak: data.dayStreak || 0,
        });
      }
      setLoadingStats(false);
    };
    fetchStats();
  }, []);

  // Dynamic greeting
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const hour = new Date().getHours();
    let timeOfDay = "Morning";
    if (hour >= 5 && hour < 12) timeOfDay = "Morning";
    else if (hour >= 12 && hour < 17) timeOfDay = "Afternoon";
    else if (hour >= 17 && hour < 21) timeOfDay = "Evening";
    else timeOfDay = "Night";
    setGreeting(`Good ${timeOfDay}`);
  }, []);

  // Verse of the Day logic (KJV, random from all Bible)
  const [verse, setVerse] = useState<{text: string, ref: string} | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(true);
  useEffect(() => {
    const books = [
      // Genesis to Revelation (abridged for brevity, add all books for production)
      "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
    ];
    // Chapters per book (abridged, use full mapping for production)
    const chaptersPerBook: Record<string, number> = {
      Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34, Joshua: 24, Judges: 21, Ruth: 4,
      "1 Samuel": 31, "2 Samuel": 24, "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36,
      Ezra: 10, Nehemiah: 13, Esther: 10, Job: 42, Psalms: 150, Proverbs: 31, Ecclesiastes: 12, "Song of Solomon": 8,
      Isaiah: 66, Jeremiah: 52, Lamentations: 5, Ezekiel: 48, Daniel: 12, Hosea: 14, Joel: 3, Amos: 9, Obadiah: 1,
      Jonah: 4, Micah: 7, Nahum: 3, Habakkuk: 3, Zephaniah: 3, Haggai: 2, Zechariah: 14, Malachi: 4,
      Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28, Romans: 16, "1 Corinthians": 16, "2 Corinthians": 13,
      Galatians: 6, Ephesians: 6, Philippians: 4, Colossians: 4, "1 Thessalonians": 5, "2 Thessalonians": 3,
      "1 Timothy": 6, "2 Timothy": 4, Titus: 3, Philemon: 1, Hebrews: 13, James: 5, "1 Peter": 5, "2 Peter": 3,
      "1 John": 5, "2 John": 1, "3 John": 1, Jude: 1, Revelation: 22
    };
    // Verses per chapter (for simplicity, pick up to 30 verses per chapter)
    const maxVersesPerChapter = 30;
    // Helper to get a valid random verse reference
    const getRandomVerseRef = () => {
      const book = books[Math.floor(Math.random() * books.length)];
      const chapter = Math.floor(Math.random() * chaptersPerBook[book]) + 1;
      const verseNum = Math.floor(Math.random() * maxVersesPerChapter) + 1;
      return { book, chapter, verseNum };
    };

    const fetchVerse = async (retryCount = 0, forceRandom = false) => {
      if (!auth.currentUser) {
        setVerse({text: "The Lord is my strength and my defense; he has become my salvation.", ref: "Exodus 15 : 2"});
        setLoadingVerse(false);
        return;
      }
      const userId = auth.currentUser.uid;
      const userDoc = doc(db, "users", userId);
      const userSnap = await getDoc(userDoc);
      const lastVerseRef = userSnap.data()?.verseOfDayRef;
      const lastTimestamp = userSnap.data()?.verseTimestamp;
      const now = Date.now();
      let verseRef;
      if (forceRandom || !lastVerseRef || !lastTimestamp || now - lastTimestamp > 24 * 60 * 60 * 1000) {
        // Always pick a new random verse reference if forceRandom is true
        verseRef = getRandomVerseRef();
        await setDoc(userDoc, {
          verseOfDayRef: verseRef,
          verseTimestamp: now
        }, { merge: true });
      } else {
        verseRef = lastVerseRef;
      }
      // Fetch verse text from bible-api.com
      try {
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(verseRef.book)}+${verseRef.chapter}:${verseRef.verseNum}?translation=kjv`);
        if (response.status === 404 || response.status === 400) {
          // Verse does not exist, always pick a new random verse (max 5 retries)
          if (retryCount < 5) {
            fetchVerse(retryCount + 1, true);
            return;
          } else {
            setVerse({text: "Verse not found.", ref: `${verseRef.book} ${verseRef.chapter} : ${verseRef.verseNum}`});
            setLoadingVerse(false);
            return;
          }
        }
        const data = await response.json();
        if (data && data.text) {
          setVerse({
            text: data.text.trim(),
            ref: `${verseRef.book} ${verseRef.chapter} : ${verseRef.verseNum}`
          });
        } else {
          // Verse not found, always pick a new random verse
          if (retryCount < 5) {
            fetchVerse(retryCount + 1, true);
            return;
          } else {
            setVerse({text: "Verse not found.", ref: `${verseRef.book} ${verseRef.chapter} : ${verseRef.verseNum}`});
          }
        }
      } catch (e) {
        setVerse({text: "Error fetching verse.", ref: `${verseRef.book} ${verseRef.chapter} : ${verseRef.verseNum}`});
      }
      setLoadingVerse(false);
    };
    fetchVerse();
  }, []);

  const handleCardClick = (label: string) => {
    if (label === "All Books") navigate("/books");
    if (label === "Favourite") navigate("/favorites");
    // Add other navigation logic as needed
  };

  return (
    <div className="min-h-screen p-0 pb-20 bg-gradient-to-b from-black to-white dark:from-black dark:to-neutral-900">
      {/* Reading Time Counter removed; only global counter remains */}
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="rounded-xl bg-gradient-to-r from-[#a91d1d] to-[#d43f3f] p-6 text-white min-h-[110px] flex flex-col justify-center">
          <div className="font-semibold text-xl">Hello {greeting}</div>
          <div className="text-base mt-2">The Bible is a manual for life; read it to understand the Creator's instructions.</div>
        </div>
      </div>
      {/* Grid Menu */}
      <div className="px-4 mt-2">
        <div className="grid grid-cols-3 gap-4">
          <div
            className={`flex flex-col items-center justify-center py-8 rounded-lg shadow-sm cursor-pointer min-h-[110px] ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
            onClick={() => handleCardClick("All Books")}
          >
            <BookOpen className="w-7 h-7 text-red-500 mb-2" />
            <span className="text-xs font-semibold">All Books</span>
          </div>
          <div className={`flex flex-col items-center justify-center py-8 rounded-lg shadow-sm cursor-pointer min-h-[110px] ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}>
            <FileText className="w-7 h-7 text-red-500 mb-2" />
            <span className="text-xs font-semibold">Notes</span>
          </div>
          <div className={`flex flex-col items-center justify-center py-8 rounded-lg shadow-sm cursor-pointer min-h-[110px] ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}>
            <Search className="w-7 h-7 text-red-500 mb-2" />
            <span className="text-xs font-semibold">Search</span>
          </div>
          <div
            className={`flex flex-col items-center justify-center py-8 rounded-lg shadow-sm cursor-pointer min-h-[110px] relative ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
            onClick={() => handleCardClick("Favourite")}
          >
            <Heart className="w-7 h-7 text-red-500 mb-2" />
            <span className="text-xs font-semibold">Favourite</span>
          </div>
          <div className={`flex flex-col items-center justify-center py-8 rounded-lg shadow-sm cursor-pointer min-h-[110px] ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}>
            <MessageSquare className="w-7 h-7 text-red-500 mb-2" />
            <span className="text-xs font-semibold">Feedback</span>
          </div>
        </div>
      </div>
      {/* Verse of the Day */}
      <div className="px-4 mt-6">
        <div className={`rounded-xl p-4 shadow ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className={`font-bold text-center text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Verse Of the Day</div>
          {loadingVerse ? (
            <div className="text-center text-sm mb-2">Loading...</div>
          ) : verse ? (
            <>
              <div className={`text-center text-sm mb-2 font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>"{verse.text}"</div>
              <div className="text-center text-xs text-red-500 font-semibold">{verse.ref}</div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Bible;