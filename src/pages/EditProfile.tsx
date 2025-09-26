import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, User, Mail, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
// Removed Firebase Storage import, using base64 in Firestore instead
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const EditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    dateOfBirth: new Date("1990-01-01"),
    location: "",
  photoURL: "",
  photoBase64: ""
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) return;
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setProfile({
          displayName: data.displayName || "",
          email: data.email || "",
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date("1990-01-01"),
          location: data.location || "",
          photoURL: data.photoURL || "",
          photoBase64: data.photoBase64 || ""
        });
      }
      setLoading(false);
    };
    fetchUser();
  }, []);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Mock location data - in real app, this would come from an API
  const locations = [
    "New York, USA", "Los Angeles, USA", "Chicago, USA", "Houston, USA",
    "London, UK", "Paris, France", "Berlin, Germany", "Tokyo, Japan",
    "Sydney, Australia", "Toronto, Canada", "Mumbai, India", "Dubai, UAE",
    "São Paulo, Brazil", "Mexico City, Mexico", "Lagos, Nigeria"
  ];

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) return;
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDoc, {
        displayName: profile.displayName,
        email: profile.email,
        dateOfBirth: profile.dateOfBirth.toISOString(),
        location: profile.location,
        photoURL: profile.photoURL,
        photoBase64: profile.photoBase64
      });
      toast({
        title: t('success'),
        description: t('profileUpdated'),
      });
      navigate(-1);
    } catch (e) {
      toast({ title: "Error", description: "Failed to update profile." });
    }
    setLoading(false);
  };

  const handleLocationChange = (value: string) => {
    setLocationSearch(value);
    setProfile(prev => ({ ...prev, location: value }));
    setShowLocationSuggestions(true);
  };

  const selectLocation = (location: string) => {
    setProfile(prev => ({ ...prev, location }));
    setLocationSearch(location);
    setShowLocationSuggestions(false);
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
          <h1 className="text-2xl font-bold text-foreground">{t('editProfile')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('personalInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Avatar & Photo Upload */}
            <div className="flex items-center gap-4">
              {profile.photoBase64 ? (
                <img src={profile.photoBase64} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              ) : profile.photoURL ? (
                <img src={profile.photoURL} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                  {profile.displayName ? profile.displayName.split(' ').map(n => n[0]).join('') : 'JD'}
                </div>
              )}
              <Button variant="outline" onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }} disabled={loading}>{t('changePhoto')}</Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onClick={e => { e.stopPropagation(); }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setLoading(true);
                  try {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProfile(prev => ({ ...prev, photoBase64: reader.result as string }));
                      setLoading(false);
                    };
                    reader.readAsDataURL(file);
                  } catch (err) {
                    toast({ title: "Error", description: "Failed to upload photo." });
                    setLoading(false);
                  }
                }}
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={profile.displayName}
                    onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                    className="pl-10"
                    placeholder="Enter your full name"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('emailAddress')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    placeholder="Enter your email"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">{t('dateOfBirth')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !profile.dateOfBirth && "text-muted-foreground"
        )}
                    >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {profile.dateOfBirth ? format(profile.dateOfBirth, "PPP") : t('pickDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={profile.dateOfBirth}
                      onSelect={(date) => date && setProfile(prev => ({ ...prev, dateOfBirth: date }))}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{t('location')}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    id="location"
                    value={locationSearch || profile.location}
                    onChange={(e) => {
                      handleLocationChange(e.target.value);
                      setProfile(prev => ({ ...prev, location: e.target.value }));
                    }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 150)}
                    className="pl-10"
                    placeholder="Enter your location"
                  />
                  {showLocationSuggestions && filteredLocations.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto z-20">
                      {filteredLocations.slice(0, 6).map((location, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-accent cursor-pointer text-sm"
                          onClick={() => selectLocation(location)}
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1" disabled={loading}>
                {loading ? 'Saving...' : t('saveChanges')}
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;