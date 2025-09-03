import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Eye, Lock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [privacy, setPrivacy] = useState({
    dataCollection: true,
    analytics: false,
    marketing: false,
    thirdPartySharing: false
  });

  const togglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    // Save to localStorage
    localStorage.setItem('privacy_settings', JSON.stringify({
      ...privacy,
      [key]: !privacy[key]
    }));
  };

  const handleDownloadData = () => {
    // Create a mock data file
    const userData = {
      profile: { name: 'User', email: 'user@example.com' },
      readingProgress: { completed: 25, favorites: 12 },
      settings: privacy
    };
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-faithchain-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleViewPrivacyPolicy = () => {
    window.open('/privacy-policy', '_blank');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.clear();
      alert('Account deletion requested. You will be contacted within 30 days.');
    }
  };

  const privacyOptions = [
    {
      key: 'dataCollection' as keyof typeof privacy,
      icon: Shield,
      label: "Data Collection",
      description: "Allow collection of usage data to improve the app"
    },
    {
      key: 'analytics' as keyof typeof privacy,
      icon: Eye,
      label: "Analytics",
      description: "Share anonymous usage analytics"
    },
    {
      key: 'marketing' as keyof typeof privacy,
      icon: Lock,
      label: "Marketing Communications",
      description: "Receive marketing emails and promotions"
    },
    {
      key: 'thirdPartySharing' as keyof typeof privacy,
      icon: Shield,
      label: "Third-party Sharing",
      description: "Allow sharing data with trusted partners"
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
          <h1 className="text-2xl font-bold text-foreground">{t('privacy')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {privacyOptions.map((option) => {
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
                    checked={privacy[option.key]}
                    onCheckedChange={() => togglePrivacy(option.key)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleDownloadData}>
              <Shield className="w-4 h-4 mr-2" />
              Download My Data
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleViewPrivacyPolicy}>
              <Eye className="w-4 h-4 mr-2" />
              View Privacy Policy
            </Button>
            <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteAccount}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;