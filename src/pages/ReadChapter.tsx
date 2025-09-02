import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Search, Bookmark, Settings, Heart, Highlighter, Palette, Copy, FileText, Share2 } from "lucide-react";

const versions = ["KJV", "NIV", "NKJV", "GNB", "NLT", "AMP"];

const versionNames: Record<string, string> = {
  KJV: "King James Version",
  NIV: "New International Version",
  NKJV: "New King James Version",
  GNB: "Good News Bible",
  NLT: "New Living Translation",
  AMP: "Amplified Bible"
};

const actionIcons = [
  { label: "Highlight", Icon: Highlighter, color: "bg-yellow-500" },
  { label: "Background", Icon: Palette, color: "bg-purple-500" },
  { label: "Copy", Icon: Copy, color: "bg-blue-500" },
  { label: "Note", Icon: FileText, color: "bg-green-500" },
  { label: "Share", Icon: Share2, color: "bg-orange-500" }
];

// Chapter titles mapping
const chapterTitles: Record<string, Record<number, string>> = {
  Genesis: { 1: "The Creation", 2: "The Garden of Eden", 3: "The Fall" },
  Exodus: { 1: "Israel in Egypt", 2: "Moses Born", 3: "The Burning Bush" },
  Leviticus: { 1: "The Burnt Offering", 2: "The Grain Offering", 3: "The Peace Offering" },
  Numbers: { 1: "The Census", 2: "Arrangement of Camps", 3: "The Levites" },
  Deuteronomy: { 1: "Moses' Speech", 2: "The Journey", 3: "The Conquest" },
  Ezekiel: { 18: "Individual Responsibility", 19: "A Lament", 20: "Israel's Rebellion" }
};

const ReadChapter = () => {
  const { book, chapter } = useParams<{ book: string; chapter: string }>();
  const [version, setVersion] = useState("KJV");
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
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
    // Handle version fallback - many versions return 404, so fallback to KJV
    const versionToUse = version.toLowerCase() === 'kjv' ? 'kjv' : 'kjv'; // For now, use KJV for all
    fetch(`https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=${versionToUse}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setChapterData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        // For demo purposes, set empty data
        setChapterData(null);
      });
  }, [book, chapter, version]);

  return (
    <div className="min-h-screen bg-background text-foreground max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-accent rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium text-muted-foreground">Faith Chain</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-accent rounded-full transition-colors">
              <BookOpen className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-accent rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-accent rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Header */}
      <div className="bg-card border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">
                {book} {chapter}
              </h1>
              <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                {version}
              </span>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              <Bookmark className="w-4 h-4" />
              Bookmark
            </button>
          </div>
          
          {/* Action Icons - Only show when verse is selected */}
          {selectedVerse && (
            <div className="flex justify-center gap-4 sm:gap-6 py-4 bg-card rounded-lg border">
              {actionIcons.map(({ label, Icon, color }) => (
                <button
                  key={label}
                  className="flex flex-col items-center gap-2 group"
                  onClick={() => {
                    console.log(`${label} clicked for verse ${selectedVerse}`);
                    setSelectedVerse(null); // Hide actions after clicking
                  }}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 ${color} rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Version Selector */}
      <div className="px-4 py-3 bg-muted/50 border-b">
        <div className="flex flex-wrap gap-2">
          {versions.map(v => (
            <button
              key={v}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                version === v 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => setVersion(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading chapter...</p>
            </div>
          </div>
        ) : chapterData ? (
          <div className="space-y-6">
            {/* Chapter Title */}
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {chapterData.reference}
              </h2>
              {/* Chapter subtitle if available */}
              {book && chapter && chapterTitles[book]?.[parseInt(chapter)] && (
                <p className="text-lg font-semibold text-primary mb-2">
                  {chapterTitles[book][parseInt(chapter)]}
                </p>
              )}
              <p className="text-sm text-muted-foreground">{versionNames[version]}</p>
            </div>

            {/* Verses */}
            <div className="space-y-3">
              {chapterData.verses ? chapterData.verses.map((verse: Verse) => (
                <div 
                  key={verse.verse} 
                  className={`group rounded-lg p-3 sm:p-4 transition-all cursor-pointer ${
                    selectedVerse === verse.verse 
                      ? 'bg-primary/10 border-2 border-primary/30' 
                      : 'hover:bg-accent/50 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedVerse(selectedVerse === verse.verse ? null : verse.verse)}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      selectedVerse === verse.verse 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {verse.verse}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground leading-relaxed text-sm sm:text-base break-words">
                        {verse.text}
                      </p>
                    </div>
                    <button 
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Heart clicked for verse', verse.verse);
                      }}
                    >
                      <Heart className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-foreground mb-2">{chapterData.text}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chapter not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadChapter;
