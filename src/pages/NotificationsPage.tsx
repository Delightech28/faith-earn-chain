import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell, Award, Calendar, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState({
    readingReminders: true,
    achievements: true,
    weeklyDigest: false,
    emailNotifications: true
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const notificationOptions = [
    {
      key: 'readingReminders' as keyof typeof notifications,
      icon: Bell,
      label: t('readingReminders'),
      description: "Get reminded about your daily reading goals"
    },
    {
      key: 'achievements' as keyof typeof notifications,
      icon: Award,
      label: t('achievements'),
      description: "Receive notifications when you unlock achievements"
    },
    {
      key: 'weeklyDigest' as keyof typeof notifications,
      icon: Calendar,
      label: t('weeklyDigest'),
      description: "Weekly summary of your reading progress"
    },
    {
      key: 'emailNotifications' as keyof typeof notifications,
      icon: Mail,
      label: "Email Notifications",
      description: "Receive important updates via email"
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
          <h1 className="text-2xl font-bold text-foreground">{t('notificationSettings')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('notifications')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {notificationOptions.map((option) => {
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
                    checked={notifications[option.key]}
                    onCheckedChange={() => toggleNotification(option.key)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;