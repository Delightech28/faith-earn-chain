import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, Search, Bookmark, Crown } from "lucide-react";

const versions = ["KJV", "NIV", "NKJV", "GNB", "NLT", "AMP"];

const versionNames: Record<string, string> = {
  KJV: "King James Version",
  NIV: "New International Version",
  NKJV: "New King James Version",
  GNB: "Good News Bible",
  NLT: "New Living Translation",
  AMP: "Amplified Bible"
};

const icons = [
  { label: "Highlight", icon: "🖍️" },
  { label: "Background", icon: "🎨" },
  { label: "Copy", icon: "📋" },
  { label: "Note", icon: "📝" },
  { label: "Share", icon: "🔗" }
];

const ReadChapter = () => {
  const { book, chapter } = useParams<{ book: string; chapter: string }>();
  const [version, setVersion] = useState("KJV");
  type Verse = {
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  };

  type ChapterData = {
    reference: string;
    verses: Verse[];
    text?: string;
  };

  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Example API: https://bible-api.com/genesis+1?translation=kjv
    fetch(`https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=${version.toLowerCase()}`)
      .then(res => res.json())
      .then(data => {
        setChapterData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [book, chapter, version]);

  return (
    <div className="min-h-screen bg-[#f7f7fa] pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-2 pt-2 pb-2 bg-white shadow-md">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="text-2xl font-bold text-gray-700"><Crown className="w-7 h-7 text-yellow-500" /></button>
          <span className="text-xs font-semibold text-gray-700">Stop Ads</span>
        </div>
        <div className="flex items-center gap-4">
          <BookOpen className="w-6 h-6 text-gray-700" />
          <Search className="w-6 h-6 text-gray-700" />
          <Bookmark className="w-6 h-6 text-gray-700" />
        </div>
      </div>
      {/* Black Section with Book/Chapter/Version Selector */}
      <div className="bg-black py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white text-lg font-bold">{book} {chapter}</span>
          <span className="text-red-500 text-lg font-bold">{version}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded bg-white text-black font-semibold">Bookmark</button>
        </div>
      </div>
      {/* Icons Row */}
      <div className="bg-black py-4 flex gap-6 justify-center rounded-b-3xl">
        {icons.map(({ label, icon }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl mb-1 shadow">{icon}</div>
            <span className="text-xs font-semibold text-white">{label}</span>
          </div>
        ))}
      </div>
      {/* Chapter Content */}
      <div className="px-4 mt-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : chapterData ? (
          <>
            <div className="font-bold text-lg mb-2 text-gray-900">{chapterData.text ? chapterData.text.split(". ")[0] : chapterData.reference}</div>
            {chapterData.verses ? chapterData.verses.map((verse: Verse) => (
              <div key={verse.verse} className="mb-6 pb-2 border-b border-gray-100">
                <div className="flex gap-2 mb-1">
                  {versions.map(v => (
                    <button
                      key={v}
                      className={`text-xs font-bold px-2 py-1 rounded ${version === v ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                      onClick={() => setVersion(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-xs font-bold text-red-600">{version}</span>
                  <span className="text-xs text-gray-500">{verse.verse}</span>
                </div>
                <div className="text-base text-gray-900 leading-relaxed">
                  {verse.text}
                </div>
              </div>
            )) : null}
          </>
        ) : (
          <div className="text-center text-gray-500">No data found.</div>
        )}
      </div>
    </div>
  );
};

export default ReadChapter;
