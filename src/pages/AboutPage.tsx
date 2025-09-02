import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Coins, Trophy, Star, Gift, Target, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutPage = () => {
  const navigate = useNavigate();
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
          <h1 className="text-2xl font-bold text-foreground">{t('about')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>FaithChain Bible App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Version:</span>
              <Badge variant="secondary">1.2.0</Badge>
            </div>
            <p className="text-muted-foreground">
              FaithChain is a revolutionary Bible reading app that combines spiritual growth with blockchain rewards. 
              Read, learn, and earn while deepening your faith journey.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              {t('rewardSystem')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Daily Reading Rewards</h4>
                  <p className="text-sm text-muted-foreground">
                    Earn 10-50 FAITH tokens for completing daily Bible reading sessions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gift className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Chapter Completion</h4>
                  <p className="text-sm text-muted-foreground">
                    Get bonus tokens for finishing complete chapters and books
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Streak Bonuses</h4>
                  <p className="text-sm text-muted-foreground">
                    Maintain reading streaks for multiplied rewards up to 5x
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {t('howToEarn')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Getting Started</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Create your account and complete profile setup</li>
                  <li>Start reading from any book in the Bible</li>
                  <li>Complete at least 5 minutes of reading daily</li>
                  <li>Track your progress and earn rewards automatically</li>
                </ol>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Maximizing Earnings</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Read consistently every day to build streaks</li>
                  <li>Complete full chapters for bonus rewards</li>
                  <li>Participate in community challenges</li>
                  <li>Share verses and invite friends</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {t('leaderboardInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The leaderboard showcases the most dedicated readers in our community. Rankings are based on:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Reading Time</span>
                <span className="text-sm text-muted-foreground">40% weight</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Chapters Completed</span>
                <span className="text-sm text-muted-foreground">30% weight</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Reading Streak</span>
                <span className="text-sm text-muted-foreground">20% weight</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Community Engagement</span>
                <span className="text-sm text-muted-foreground">10% weight</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium">Monthly Rewards</p>
              <p className="text-sm text-muted-foreground">Top 10 users receive bonus FAITH tokens and exclusive badges!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Email:</span> support@faithchain.app
            </p>
            <p className="text-sm">
              <span className="font-medium">Website:</span> www.faithchain.app
            </p>
            <p className="text-sm">
              <span className="font-medium">Community:</span> Join our Discord server for support and fellowship
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;