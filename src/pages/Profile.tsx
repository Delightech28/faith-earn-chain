import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, BookOpen, Award, Clock, Calendar, LogOut, Edit, Sliders } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReadingTimeTracker } from "@/hooks/useReadingTimeTracker";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { formatReadingTime } = useReadingTimeTracker();
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.error("Logout failed:", e);
    }
    localStorage.removeItem("faithchain_user");
    window.location.href = "/";
  };

  // Define a type for user data
  interface UserData {
    displayName?: string;
    email?: string;
    photoURL?: string;
    photoBase64?: string;
    createdAt?: string | number | Date;
    tier?: string;
    theme?: 'light' | 'dark';
    // Add other fields as needed
  }
  // User data state
  const [userData, setUserData] = useState<UserData | null>(null);

  // Theme state and context
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    if (userData?.theme && userData.theme !== theme) {
      // Sync context with Firestore value
      if (userData.theme === 'dark' && theme !== 'dark') toggleTheme();
      if (userData.theme === 'light' && theme !== 'light') toggleTheme();
    }
    // eslint-disable-next-line
  }, [userData]);

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    if (newTheme !== theme) toggleTheme();
    if (auth.currentUser) {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDoc, { theme: newTheme });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) return;
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        setUserData(userSnap.data() as UserData);
      }
    };
    fetchUser();
  }, []);

  // Stats state
  const [stats, setStats] = useState({
    totalReadingTime: 0,
    totalTokensEarned: 0,
    booksCompleted: 0,
    streakDays: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) return;
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setStats({
          totalReadingTime: data.readingTime || 0,
          totalTokensEarned: data.tokensEarned || 0,
          booksCompleted: data.booksRead || 0,
          streakDays: data.dayStreak || 0,
        });
      }
    };
    fetchStats();
  }, []);

  const userStats = {
    ...stats,
    joinDate: userData?.createdAt ? new Date(userData.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) : "November 2024",
    currentTier: userData?.tier || "Gold"
  };

  // Reset stats handler
  const handleResetStats = async () => {
    if (!auth.currentUser) return;
    const userDoc = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDoc, {
      readingTime: 0,
      tokensEarned: 0,
      booksRead: 0,
      dayStreak: 0
    });
    setStats({
      totalReadingTime: 0,
      totalTokensEarned: 0,
      booksCompleted: 0,
      streakDays: 0,
    });
  };

  const achievements = [
    { name: "First Steps", description: "Complete your first reading session", earned: true },
    { name: "Dedication", description: "Read for 7 consecutive days", earned: true },
    { name: "Scholar", description: "Complete reading a full book", earned: true },
    { name: "Centurion", description: "Earn 100 tokens", earned: true },
    { name: "Marathon", description: "Read for 10 hours in a week", earned: false },
    { name: "Master", description: "Reach Diamond tier", earned: false },
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>

        {/* User Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {userData?.photoBase64 ? (
                <img src={userData.photoBase64} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              ) : userData?.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                  {userData?.displayName ? userData.displayName.split(' ').map(n => n[0]).join('') : 'JD'}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{userData?.displayName || "John Doe"}</h2>
                <p className="text-muted-foreground">{userData?.email || "john.doe@example.com"}</p>
                <div className="flex flex-col items-start gap-1 mt-1">
                  <Badge variant="default">
                    <span className="text-xs">{userStats.currentTier} Member</span>
                  </Badge>
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="text-xs">Joined {userStats.joinDate}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{formatReadingTime(userStats.totalReadingTime)}</p>
              <p className="text-sm text-muted-foreground">Reading Time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{userStats.totalTokensEarned}</p>
              <p className="text-sm text-muted-foreground">Tokens Earned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{userStats.booksCompleted}</p>
              <p className="text-sm text-muted-foreground">Books Read</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{userStats.streakDays}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  achievement.earned ? 'bg-green-50 border-green-200' : 'bg-muted/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-green-500 text-white' : 'bg-muted'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${achievement.earned ? 'text-green-700' : 'text-muted-foreground'}`}>
                    {achievement.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <Badge className="bg-green-500">Earned</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>



        {/* Settings and Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              {t('settings')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/edit-profile')}
            >
              <Edit className="w-4 h-4 mr-2" />
              {t('editProfile')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/app-preferences')}
            >
              <Sliders className="w-4 h-4 mr-2" />
              {t('appPreferences')}
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;