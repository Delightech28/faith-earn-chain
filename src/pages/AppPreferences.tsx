import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell, Volume2, Bookmark, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AppPreferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    notifications: true,
    soundEffects: true,
    autoBookmark: false,
    readerMode: true,
    dailyReminders: true,
    offlineReading: false
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const preferenceOptions = [
    {
      key: 'notifications' as keyof typeof preferences,
      icon: Bell,
      label: "Push Notifications",
      description: "Receive notifications for reading reminders and achievements"
    },
    {
      key: 'soundEffects' as keyof typeof preferences,
      icon: Volume2,
      label: "Sound Effects",
      description: "Play sounds for interactions and achievements"
    },
    {
      key: 'autoBookmark' as keyof typeof preferences,
      icon: Bookmark,
      label: "Auto Bookmark",
      description: "Automatically bookmark your reading progress"
    },
    {
      key: 'readerMode' as keyof typeof preferences,
      icon: Eye,
      label: "Enhanced Reader Mode",
      description: "Optimize text for comfortable reading"
    },
    {
      key: 'dailyReminders' as keyof typeof preferences,
      icon: Clock,
      label: "Daily Reading Reminders",
      description: "Get reminded to continue your daily reading"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">App Preferences</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reading Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {preferenceOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.key} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <Icon className="w-5 h-5 text-primary" />
                    <div className="space-y-1">
                      <Label htmlFor={option.key} className="text-base font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={option.key}
                    checked={preferences[option.key]}
                    onCheckedChange={() => togglePreference(option.key)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reset Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Reset Reading Progress
            </Button>
            <Button variant="outline" className="w-full">
              Clear All Bookmarks
            </Button>
            <Button variant="destructive" className="w-full">
              Reset All Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppPreferences;