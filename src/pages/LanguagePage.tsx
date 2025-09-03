import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguagePage = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' }
  ];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
  };

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
          <h1 className="text-2xl font-bold text-foreground">{t('language')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('language')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "ghost"}
                className="w-full justify-between h-auto p-4"
                onClick={() => handleLanguageChange(lang.code)}
              >
                <div className="text-left">
                  <p className="font-medium">{lang.nativeName}</p>
                  <p className="text-sm text-muted-foreground">{lang.name}</p>
                </div>
                {language === lang.code && (
                  <Check className="w-5 h-5" />
                )}
              </Button>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default LanguagePage;