import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Clock, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const mockLeaderboard = [
  { rank: 1, name: "Sarah Johnson", readingTime: 1250, tokensEarned: 125, avatar: "SJ" },
  { rank: 2, name: "Michael Chen", readingTime: 1180, tokensEarned: 118, avatar: "MC" },
  { rank: 3, name: "David Smith", readingTime: 1050, tokensEarned: 105, avatar: "DS" },
  { rank: 4, name: "Emma Wilson", readingTime: 980, tokensEarned: 98, avatar: "EW" },
  { rank: 5, name: "James Brown", readingTime: 920, tokensEarned: 92, avatar: "JB" },
  { rank: 6, name: "You", readingTime: 850, tokensEarned: 85, avatar: "YU", isCurrentUser: true },
  { rank: 7, name: "Lisa Garcia", readingTime: 780, tokensEarned: 78, avatar: "LG" },
  { rank: 8, name: "Robert Taylor", readingTime: 720, tokensEarned: 72, avatar: "RT" },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
};

const Leaderboard = () => {
  const { t } = useLanguage();
  const currentUserRank = mockLeaderboard.find(user => user.isCurrentUser);

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('leaderboard')}</h1>

        {/* Current User Stats */}
        {currentUserRank && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                {t('yourRank')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {currentUserRank.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Rank #{currentUserRank.rank}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.floor(currentUserRank.readingTime / 60)}h {currentUserRank.readingTime % 60}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {currentUserRank.tokensEarned} FC
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {t('topReadersThisMonth')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockLeaderboard.map((user) => (
              <div 
                key={user.rank}
                className={`flex items-center gap-4 p-3 rounded-lg border ${
                  user.isCurrentUser ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(user.rank)}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    user.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {user.avatar}
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${user.isCurrentUser ? 'text-primary' : ''}`}>
                    {user.name}
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(user.readingTime / 60)}h {user.readingTime % 60}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {user.tokensEarned} FC
                    </span>
                  </div>
                </div>
                
                {user.rank <= 3 && (
                  <Badge variant={user.rank === 1 ? "default" : "secondary"}>
                    {user.rank === 1 ? t('champion') : user.rank === 2 ? t('runnerUp') : t('thirdPlace')}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Challenges */}
        <Card>
          <CardHeader>
            <CardTitle>{t('weeklyChallenge')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h3 className="font-semibold">{t('readFor7Hours')}</h3>
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">4.5/7 {t('hoursCompleted')}</p>
                </div>
                <Badge className="mt-2">+50 {t('fcBonus')}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;