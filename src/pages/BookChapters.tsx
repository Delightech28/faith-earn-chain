import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// Book name to chapter count mapping
const chaptersMap: Record<string, number> = {
  Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34, Joshua: 24, Judges: 21, Ruth: 4, "1 Samuel": 31, "2 Samuel": 24, "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36, Ezra: 10, Nehemiah: 13, Esther: 10, Job: 42, Psalm: 150, Proverbs: 31, Ecclesiastes: 12, "Song of Solomon": 8, Isaiah: 66, Jeremiah: 52, Lamentations: 5, Ezekiel: 48, Daniel: 12, Hosea: 14, Joel: 3, Amos: 9, Obadiah: 1, Jonah: 4, Micah: 7, Nahum: 3, Habakkuk: 3, Zephaniah: 3, Haggai: 2, Zechariah: 14, Malachi: 4,
  Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28, Romans: 16, "1 Corinthians": 16, "2 Corinthians": 13, Galatians: 6, Ephesians: 6, Philippians: 4, Colossians: 4, "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4, Titus: 3, Philemon: 1, Hebrews: 13, James: 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1, Jude: 1, Revelation: 22
};

const BookChapters = () => {
  const { bookName } = useParams<{ bookName: string }>();
  const navigate = useNavigate();
  const chapters = chaptersMap[bookName || ""] || 0;

  return (
  <div className="min-h-screen bg-[#f7f7fa] dark:bg-[#18181b] pb-20">
      {/* Header */}
  <div className="flex items-center justify-between px-4 pt-4 pb-2 shadow-md bg-white dark:bg-zinc-900">
  <button onClick={() => navigate(-1)} className="text-3xl font-bold text-gray-700 dark:text-gray-200">&#8592;</button>
  <div className="font-bold text-xl text-gray-900 dark:text-white">{bookName}</div>
        <div className="w-8 h-8" />
      </div>
      {/* Tabs (for context, not interactive) */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <button
          className={`text-base font-semibold pb-1 border-b-2 ${isOldTestament(bookName) ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400'}`}
          onClick={() => navigate('/books?tab=old')}
        >
          Old Testament
        </button>
        <button
          className={`text-base font-semibold pb-1 border-b-2 ${!isOldTestament(bookName) ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400'}`}
          onClick={() => navigate('/books?tab=new')}
        >
          New Testament
        </button>
      </div>
      {/* Chapters Grid */}
      <div className="px-4 mt-8 mb-8">
        <div className="grid grid-cols-5 gap-6 justify-center">
          {Array.from({ length: chapters }, (_, i) => (
            <div
              key={i + 1}
              className="px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 shadow text-gray-900 dark:text-white text-lg font-semibold cursor-pointer text-center"
              onClick={() => navigate(`/read/${encodeURIComponent(bookName || '')}/${i + 1}`)}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper to determine testament
function isOldTestament(book: string | undefined) {
  const oldTestament = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalm", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
  ];
  return oldTestament.includes(book || "");
}

export default BookChapters;
