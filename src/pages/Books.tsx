import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const oldTestament = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalm", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

const newTestament = [
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const Books = () => {
  const [tab, setTab] = useState<'old' | 'new'>('old');
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
  <div className="min-h-screen bg-[#f7f7fa] dark:bg-[#18181b] pb-20">
      {/* Header */}
  <div className="flex items-center justify-between px-4 pt-4 pb-2 shadow-md bg-white dark:bg-zinc-900">
  <button onClick={() => window.history.back()} className="text-3xl font-bold text-gray-700 dark:text-gray-200">&#8592;</button>
  <div className="font-bold text-xl text-gray-900 dark:text-white">{t('books')}</div>
        <div className="w-8 h-8" />
      </div>
      {/* Tabs */}
  <div className="flex items-center justify-center gap-8 mt-6">
        <button
          className={`text-base font-semibold pb-1 border-b-2 ${tab === 'old' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400'}`}
          onClick={() => setTab('old')}
        >
          {t('oldTestament')}
        </button>
        <button
          className={`text-base font-semibold pb-1 border-b-2 ${tab === 'new' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400'}`}
          onClick={() => setTab('new')}
        >
          {t('newTestament')}
        </button>
      </div>
      {/* Books List */}
      <div className="px-4 mt-8 mb-8">
        <div className="flex flex-wrap gap-x-4 gap-y-5 justify-center">
          {(tab === 'old' ? oldTestament : newTestament).map(book => (
            <div
              key={book}
              className="px-4 py-2 rounded-full bg-white dark:bg-zinc-800 shadow text-gray-900 dark:text-white text-base font-semibold cursor-pointer"
              style={{minWidth: 90, minHeight: 36, fontSize: '1rem'}}
              onClick={() => navigate(`/books/${encodeURIComponent(book)}`)}
            >
              {book}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Books;
