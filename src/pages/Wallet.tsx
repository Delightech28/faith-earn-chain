import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, TrendingUp, Send, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockTransactions = [
  { id: 1, type: "earned", amount: 5, description: "Bible reading - 50 minutes", date: "2024-01-15" },
  { id: 2, type: "earned", amount: 3, description: "Daily challenge completed", date: "2024-01-14" },
  { id: 3, type: "earned", amount: 8, description: "Bible reading - 80 minutes", date: "2024-01-13" },
  { id: 4, type: "withdrawn", amount: -10, description: "Withdrawal to external wallet", date: "2024-01-12" },
];

const Wallet = () => {
  const totalBalance = 47;
  const totalEarned = 156;
  const { toast } = useToast();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678");
    toast({
      description: "Wallet address copied to clipboard!",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <WalletIcon className="w-6 h-6" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-foreground">{totalBalance} FC</p>
                <p className="text-muted-foreground">FaithChain Tokens</p>
              </div>
              <div className="flex gap-3">
                <Button className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">{totalEarned} FC</p>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <WalletIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-semibold">Gold</p>
                  <p className="text-sm text-muted-foreground">Tier Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                <Badge 
                  variant={transaction.type === "earned" ? "default" : "secondary"}
                  className={transaction.type === "earned" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}
                >
                  {transaction.amount > 0 ? "+" : ""}{transaction.amount} FC
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Wallet Address */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted rounded-lg flex items-center justify-between gap-3">
              <p className="font-mono text-sm break-all flex-1">0x1234567890abcdef1234567890abcdef12345678</p>
              <button
                onClick={handleCopyAddress}
                className="p-2 hover:bg-accent rounded-md transition-colors flex-shrink-0"
                title="Copy address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This is your auto-generated wallet address for receiving tokens.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;