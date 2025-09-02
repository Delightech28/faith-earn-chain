import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const DarkModePage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

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
          <h1 className="text-2xl font-bold text-foreground">{t('darkMode')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-3 flex-1">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <div className="space-y-1">
                  <Label htmlFor="darkmode" className="text-base font-medium cursor-pointer">
                    {t('darkMode')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                  </p>
                </div>
              </div>
              <Switch
                id="darkmode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary text-primary-foreground rounded-lg">
                Primary Color Preview
              </div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
                Secondary Color Preview
              </div>
              <div className="p-4 bg-muted text-muted-foreground rounded-lg">
                Muted Color Preview
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DarkModePage;