import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Award } from "lucide-react";

const bibleVersions = {
  KJV: "King James Version",
  NIV: "New International Version",
  NKJV: "New King James Version",
  ESV: "English Standard Version"
};

const mockVerses = {
  KJV: {
    reference: "John 3:16",
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
  },
  NIV: {
    reference: "John 3:16",
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
  },
  NKJV: {
    reference: "John 3:16", 
    text: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life."
  },
  ESV: {
    reference: "John 3:16",
    text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."
  }
};

const Bible = () => {
  const [selectedVersion, setSelectedVersion] = useState<keyof typeof bibleVersions>("KJV");
  const [readingTime, setReadingTime] = useState(0);
  const [tokensEarned, setTokensEarned] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
      // Earn 1 token per 60 seconds (1 minute) for demo
      if (readingTime > 0 && readingTime % 60 === 0) {
        setTokensEarned(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [readingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with stats */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Bible Study</h1>
          <div className="flex gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(readingTime)}
            </Badge>
            <Badge variant="default" className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              {tokensEarned} Tokens
            </Badge>
          </div>
        </div>

        {/* Version selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Bible Version</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedVersion} onValueChange={(value: keyof typeof bibleVersions) => setSelectedVersion(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a Bible version" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(bibleVersions).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {key} - {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Bible verse display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">
              {mockVerses[selectedVersion].reference} ({selectedVersion})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-foreground">
              {mockVerses[selectedVersion].text}
            </p>
          </CardContent>
        </Card>

        {/* Daily verse suggestion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">Today's recommended reading:</p>
            <p className="font-medium">Psalm 23 - The Lord is my shepherd</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Bible;