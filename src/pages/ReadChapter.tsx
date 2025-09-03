import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Search, Bookmark, Settings, Heart, Highlighter, Palette, Copy, FileText, Share2 } from "lucide-react";
import { useReadingTimeTracker } from "@/hooks/useReadingTimeTracker";

const versions = ["KJV", "NIV", "NKJV", "GNB", "NLT", "AMP"];

const versionNames: Record<string, string> = {
  KJV: "King James Version",
  NIV: "New International Version",
  NKJV: "New King James Version",
  GNB: "Good News Bible",
  NLT: "New Living Translation",
  AMP: "Amplified Bible"
};

// Mock Bible data for different versions
const mockBibleData: Record<string, Record<string, any>> = {
  "Genesis 1": {
    KJV: {
      reference: "Genesis 1",
      verses: [
        { verse: 1, text: "In the beginning God created the heaven and the earth." },
        { verse: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
        { verse: 3, text: "And God said, Let there be light: and there was light." },
        { verse: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
        { verse: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day." }
      ]
    },
    NIV: {
      reference: "Genesis 1",
      verses: [
        { verse: 1, text: "In the beginning God created the heavens and the earth." },
        { verse: 2, text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters." },
        { verse: 3, text: "And God said, \"Let there be light,\" and there was light." },
        { verse: 4, text: "God saw that the light was good, and he separated the light from the darkness." },
        { verse: 5, text: "God called the light \"day,\" and the darkness he called \"night.\" And there was evening, and there was morning—the first day." }
      ]
    },
    NKJV: {
      reference: "Genesis 1",
      verses: [
        { verse: 1, text: "In the beginning God created the heavens and the earth." },
        { verse: 2, text: "The earth was without form, and void; and darkness was on the face of the deep. And the Spirit of God was hovering over the face of the waters." },
        { verse: 3, text: "Then God said, \"Let there be light\"; and there was light." },
        { verse: 4, text: "And God saw the light, that it was good; and God divided the light from the darkness." },
        { verse: 5, text: "God called the light Day, and the darkness He called Night. So the evening and the morning were the first day." }
      ]
    },
    GNB: {
      reference: "Genesis 1",
      verses: [
        { verse: 1, text: "In the beginning, when God created the universe," },
        { verse: 2, text: "the earth was formless and desolate. The raging ocean that covered everything was engulfed in total darkness, and the Spirit of God was moving over the water." },
        { verse: 3, text: "Then God commanded, \"Let there be light\"—and light appeared." },
        { verse: 4, text: "God was pleased with what he saw. Then he separated the light from the darkness," },
        { verse: 5, text: "and he named the light \"Day\" and the darkness \"Night.\" Evening passed and morning came—that was the first day." }
      ]
    },
    NLT: {
      reference: "Genesis 1",
      verses: [
        { verse: 1, text: "In the beginning God created the heavens and the earth." },
        { verse: 2, text: "The earth was formless and empty, and darkness covered the deep waters. And the Spirit of God was hovering over the surface of the waters." },
        { verse: 3, text: "Then God said, \"Let there be light,\" and there was light." },
        { verse: 4, text: "And God saw that the light was good. Then he separated the light from the darkness." },
        { verse: 5, text: "God called the light \"day\" and the darkness \"night.\" And evening passed and morning came, marking the first day." }
      ]
    },
    AMP: {
      reference: "Genesis 1",
      verses: [
        { verse: 1, text: "In the beginning God (Elohim) created [by forming from nothing] the heavens and the earth." },
        { verse: 2, text: "The earth was formless and void or a waste and emptiness, and darkness was upon the face of the deep [primeval ocean that covered the unformed earth]. The Spirit of God was moving (hovering, brooding) over the face of the waters." },
        { verse: 3, text: "And God said, \"Let there be light\"; and there was light." },
        { verse: 4, text: "God saw that the light was good (pleasing, useful) and He affirmed and sustained it; and God separated the light from the darkness." },
        { verse: 5, text: "And God called the light day, and the darkness He called night. And there was evening and there was morning, one day." }
      ]
    }
  },
  "Leviticus 2": {
    KJV: {
      reference: "Leviticus 2",
      verses: [
        { verse: 1, text: "And when any will offer a meat offering unto the LORD, his offering shall be of fine flour; and he shall pour oil upon it, and put frankincense thereon:" },
        { verse: 2, text: "And he shall bring it to Aaron's sons the priests: and he shall take thereout his handful of the flour thereof, and of the oil thereof, with all the frankincense thereof; and the priest shall burn the memorial of it upon the altar, to be an offering made by fire, of a sweet savour unto the LORD:" },
        { verse: 3, text: "And the remnant of the meat offering shall be Aaron's and his sons': it is a thing most holy of the offerings of the LORD made by fire." }
      ]
    },
    NIV: {
      reference: "Leviticus 2",
      verses: [
        { verse: 1, text: "\"When anyone brings a grain offering to the LORD, their offering is to be of the finest flour. They are to pour olive oil on it, put incense on it" },
        { verse: 2, text: "and take it to Aaron's sons the priests. The priest shall take a handful of the flour and oil, together with all the incense, and burn this as a memorial portion on the altar, a food offering, an aroma pleasing to the LORD." },
        { verse: 3, text: "The rest of the grain offering belongs to Aaron and his sons; it is a most holy part of the food offerings presented to the LORD." }
      ]
    },
    NKJV: {
      reference: "Leviticus 2",
      verses: [
        { verse: 1, text: "When anyone offers a grain offering to the LORD, his offering shall be of fine flour. And he shall pour oil on it, and put frankincense on it." },
        { verse: 2, text: "He shall bring it to Aaron's sons, the priests, one of whom shall take from it his handful of fine flour and oil with all the frankincense. And the priest shall burn it as a memorial on the altar, an offering made by fire, a sweet aroma to the LORD." },
        { verse: 3, text: "The rest of the grain offering shall be Aaron's and his sons'. It is most holy of the offerings to the LORD made by fire." }
      ]
    },
    GNB: {
      reference: "Leviticus 2",
      verses: [
        { verse: 1, text: "When any of you present an offering of grain to the LORD, you must first grind it into flour. You must put olive oil and incense on it" },
        { verse: 2, text: "and bring it to the Aaronite priests. The officiating priest shall take a handful of the flour and oil and all of the incense and burn it on the altar as a token that it has all been offered to the LORD. The odor of this food offering is pleasing to the LORD." },
        { verse: 3, text: "The rest of the grain offering belongs to Aaron and his sons; it is very holy, since it is taken from the food offered to the LORD." }
      ]
    },
    NLT: {
      reference: "Leviticus 2",
      verses: [
        { verse: 1, text: "\"When you present grain as an offering to the LORD, the offering must consist of choice flour. You must pour olive oil on it, sprinkle it with frankincense," },
        { verse: 2, text: "and bring it to Aaron's sons, the priests. The priest will scoop out a handful of the flour moistened with oil, together with all the frankincense, and burn this representative portion on the altar. It is a special gift, a pleasing aroma to the LORD." },
        { verse: 3, text: "The rest of the grain offering will then be given to Aaron and his sons. This offering will be considered most holy among the special gifts presented to the LORD." }
      ]
    },
    AMP: {
      reference: "Leviticus 2",
      verses: [
        { verse: 1, text: "When anyone offers a grain offering to the LORD, his offering shall be of fine flour, and he shall pour [olive] oil on it and put frankincense on it." },
        { verse: 2, text: "He shall bring it to Aaron's sons the priests. Out of it he shall take his handful of the fine flour and the oil, with all of its frankincense, and the priest shall offer this up in smoke on the altar [to be burned] as the memorial portion of it. It is an offering by fire, a sweet and soothing aroma to the LORD." },
        { verse: 3, text: "What is left of the grain offering belongs to Aaron and his sons; it is most holy among the offerings to the LORD by fire." }
      ]
    }
  },
  "Ezekiel 18": {
    KJV: {
      reference: "Ezekiel 18",
      verses: [
        { verse: 1, text: "The word of the LORD came unto me again, saying," },
        { verse: 2, text: "What mean ye, that ye use this proverb concerning the land of Israel, saying, The fathers have eaten sour grapes, and the children's teeth are set on edge?" },
        { verse: 3, text: "As I live, saith the Lord GOD, ye shall not have occasion any more to use this proverb in Israel." },
        { verse: 4, text: "Behold, all souls are mine; as the soul of the father, so also the soul of the son is mine: the soul that sinneth, it shall die." }
      ]
    },
    NIV: {
      reference: "Ezekiel 18",
      verses: [
        { verse: 1, text: "The word of the LORD came to me:" },
        { verse: 2, text: "\"What do you people mean by quoting this proverb about the land of Israel: 'The parents eat sour grapes, and the children's teeth are set on edge'?\"" },
        { verse: 3, text: "\"As surely as I live, declares the Sovereign LORD, you will no longer quote this proverb in Israel." },
        { verse: 4, text: "For everyone belongs to me, the parent as well as the child—both alike belong to me. The one who sins is the one who will die." }
      ]
    },
    NKJV: {
      reference: "Ezekiel 18",
      verses: [
        { verse: 1, text: "The word of the LORD came to me again, saying," },
        { verse: 2, text: "\"What do you mean when you use this proverb concerning the land of Israel, saying: 'The fathers have eaten sour grapes, And the children's teeth are set on edge'?\"" },
        { verse: 3, text: "\"As I live,\" says the Lord GOD, \"you shall no longer use this proverb in Israel." },
        { verse: 4, text: "\"Behold, all souls are Mine; The soul of the father As well as the soul of the son is Mine; The soul who sins shall die." }
      ]
    },
    GNB: {
      reference: "Ezekiel 18",
      verses: [
        { verse: 1, text: "The LORD spoke to me" },
        { verse: 2, text: "and said, \"What is this proverb people keep repeating in the land of Israel? 'The parents ate the sour grapes, But the children got the sour taste.'\"" },
        { verse: 3, text: "\"As surely as I am the living God,\" says the Sovereign LORD, \"you will not repeat this proverb in Israel any more." },
        { verse: 4, text: "The life of every person belongs to me, the life of the parent as well as that of the child. The person who sins is the one who will die." }
      ]
    },
    NLT: {
      reference: "Ezekiel 18",
      verses: [
        { verse: 1, text: "Then another message came to me from the LORD:" },
        { verse: 2, text: "\"Why do you quote this proverb concerning the land of Israel: 'The parents have eaten sour grapes, but their children's mouths pucker at the taste'?\"" },
        { verse: 3, text: "\"As surely as I live, says the Sovereign LORD, you will not quote this proverb anymore in Israel." },
        { verse: 4, text: "For all people are mine to judge—both parents and children alike. And this is my rule: The person who sins is the one who will die." }
      ]
    },
    AMP: {
      reference: "Ezekiel 18",
      verses: [
        { verse: 1, text: "The word of the LORD came to me again, saying," },
        { verse: 2, text: "\"What do you mean by using this proverb concerning the land of Israel, saying, 'The fathers eat sour grapes, but the children's teeth are set on edge'?\"" },
        { verse: 3, text: "\"As I live,\" declares the Lord GOD, \"you are no longer to use this proverb in Israel." },
        { verse: 4, text: "\"Behold, all souls are Mine; the soul of the father as well as the soul of the son is Mine. The soul who sins will [be the one who] dies." }
      ]
    }
  }
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
  useReadingTimeTracker(); // Start tracking reading time
  const [version, setVersion] = useState("KJV");
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [highlights, setHighlights] = useState<Set<number>>(new Set());
  const [backgrounds, setBackgrounds] = useState<Set<number>>(new Set());
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleAction = (action: string, verseNumber: number) => {
    switch (action) {
      case 'Highlight':
        setHighlights(prev => {
          const newHighlights = new Set(prev);
          if (newHighlights.has(verseNumber)) {
            newHighlights.delete(verseNumber);
          } else {
            newHighlights.add(verseNumber);
          }
          return newHighlights;
        });
        break;
      case 'Background':
        setBackgrounds(prev => {
          const newBackgrounds = new Set(prev);
          if (newBackgrounds.has(verseNumber)) {
            newBackgrounds.delete(verseNumber);
          } else {
            newBackgrounds.add(verseNumber);
          }
          return newBackgrounds;
        });
        break;
      case 'Copy':
        const verseData = chapterData?.verses.find(v => v.verse === verseNumber);
        if (verseData) {
          navigator.clipboard.writeText(`${book} ${chapter}:${verseNumber} - ${verseData.text} (${version})`);
          // You could add a toast notification here
          console.log('Verse copied to clipboard');
        }
        break;
      case 'Note':
        const note = prompt('Add your note:', notes[verseNumber] || '');
        if (note !== null) {
          setNotes(prev => ({
            ...prev,
            [verseNumber]: note
          }));
        }
        break;
      case 'Share':
        const shareVerseData = chapterData?.verses.find(v => v.verse === verseNumber);
        if (shareVerseData && navigator.share) {
          navigator.share({
            title: `${book} ${chapter}:${verseNumber}`,
            text: `${shareVerseData.text} - ${book} ${chapter}:${verseNumber} (${version})`,
            url: window.location.href
          });
        } else {
          // Fallback for browsers that don't support Web Share API
          const shareText = `${shareVerseData?.text} - ${book} ${chapter}:${verseNumber} (${version})`;
          navigator.clipboard.writeText(shareText);
          console.log('Verse copied for sharing');
        }
        break;
    }
    setSelectedVerse(null);
  };

  useEffect(() => {
    setLoading(true);
    const chapterKey = `${book} ${chapter}`;
    
    // Check if we have mock data for this chapter
    if (mockBibleData[chapterKey] && mockBibleData[chapterKey][version]) {
      setChapterData(mockBibleData[chapterKey][version]);
      setLoading(false);
    } else {
      // Fallback to API for KJV only
      fetch(`https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=kjv`)
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
          setChapterData(null);
        });
    }
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
            <button 
              className="p-2 hover:bg-accent rounded-full transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-accent rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      <div className={`bg-card border-b transition-all duration-300 ease-in-out overflow-hidden ${
        searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search in this chapter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
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
                   onClick={() => handleAction(label, selectedVerse)}
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
                      : highlights.has(verse.verse)
                      ? 'bg-yellow-100 border-2 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700'
                      : backgrounds.has(verse.verse)
                      ? 'bg-purple-100 border-2 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700'
                      : 'hover:bg-accent/50 border-2 border-transparent'
                  } ${notes[verse.verse] ? 'relative' : ''}`}
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
                      {notes[verse.verse] && (
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-700 dark:text-green-300 border-l-2 border-green-500">
                          <strong>Note:</strong> {notes[verse.verse]}
                        </div>
                      )}
                    </div>
                    <button 
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavorites(prev => {
                          const newFavorites = new Set(prev);
                          if (newFavorites.has(verse.verse)) {
                            newFavorites.delete(verse.verse);
                          } else {
                            newFavorites.add(verse.verse);
                          }
                          return newFavorites;
                        });
                      }}
                    >
                      <Heart className={`w-4 h-4 transition-colors ${
                        favorites.has(verse.verse) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-muted-foreground hover:text-red-400'
                      }`} />
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
