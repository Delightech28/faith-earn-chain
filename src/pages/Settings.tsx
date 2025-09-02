import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Moon, Sun, Globe, Shield, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const settingsOptions = [
    { 
      icon: Bell, 
      label: t('notifications'), 
      description: "Manage push notifications and alerts",
      route: "/notifications"
    },
    { 
      icon: Moon, 
      label: t('darkMode'), 
      description: "Toggle between light and dark themes",
      route: "/dark-mode"
    },
    { 
      icon: Globe, 
      label: t('language'), 
      description: "Choose your preferred language",
      route: "/language"
    },
    { 
      icon: Shield, 
      label: t('privacy'), 
      description: "Privacy and security settings",
      route: "/privacy"
    },
    { 
      icon: Info, 
      label: t('about'), 
      description: "App version and information",
      route: "/about"
    },
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
          <h1 className="text-2xl font-bold text-foreground">{t('settings')}</h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            {settingsOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => navigate(option.route)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;