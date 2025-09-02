import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell, Volume2, Bookmark, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const AppPreferences = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
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

  const handleResetProgress = () => {
    toast({
      title: "Reading Progress Reset",
      description: "All reading progress has been cleared.",
    });
  };

  const handleClearBookmarks = () => {
    toast({
      title: "Bookmarks Cleared",
      description: "All bookmarks have been removed.",
    });
  };

  const handleResetPreferences = () => {
    setPreferences({
      notifications: true,
      soundEffects: true,
      autoBookmark: false,
      readerMode: true,
      dailyReminders: true,
      offlineReading: false
    });
    toast({
      title: "Preferences Reset",
      description: "All preferences have been reset to default values.",
    });
  };

  const preferenceOptions = [
    {
      key: 'notifications' as keyof typeof preferences,
      icon: Bell,
      label: t('pushNotifications'),
      description: t('pushNotificationsDesc')
    },
    {
      key: 'soundEffects' as keyof typeof preferences,
      icon: Volume2,
      label: t('soundEffects'),
      description: t('soundEffectsDesc')
    },
    {
      key: 'autoBookmark' as keyof typeof preferences,
      icon: Bookmark,
      label: t('autoBookmark'),
      description: t('autoBookmarkDesc')
    },
    {
      key: 'readerMode' as keyof typeof preferences,
      icon: Eye,
      label: t('enhancedReaderMode'),
      description: t('enhancedReaderModeDesc')
    },
    {
      key: 'dailyReminders' as keyof typeof preferences,
      icon: Clock,
      label: t('dailyReadingReminders'),
      description: t('dailyReadingRemindersDesc')
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
          <h1 className="text-2xl font-bold text-foreground">{t('appPreferences')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('readingPreferences')}</CardTitle>
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
            <CardTitle>{t('resetOptions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleResetProgress}>
              {t('resetReadingProgress')}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleClearBookmarks}>
              {t('clearAllBookmarks')}
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleResetPreferences}>
              {t('resetAllPreferences')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppPreferences;