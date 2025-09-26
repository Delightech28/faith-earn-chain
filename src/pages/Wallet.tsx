import ReadingTimeCounter from "@/components/ReadingTimeCounter";
      {/* Reading Time Counter (fixed at top right) */}
      <div className="fixed top-20 right-4 z-[100]">
        <ReadingTimeCounter />
      </div>
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, TrendingUp, Send, Download, Copy, Settings } from "lucide-react";
import { useEffect, useState } from "react";
// Removed unused Avalanche/AvmBuffer import from wallet-sdk
import { ethers } from 'ethers';
import { QRCodeSVG } from 'qrcode.react';
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [walletAddress, setWalletAddress] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [avaxBalance, setAvaxBalance] = useState<string | null>(null);
  const [showReceive, setShowReceive] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const addr = userSnap.data().walletAddress || "";
          setWalletAddress(addr);
          setMnemonic(userSnap.data().walletMnemonic || "");
          if (addr) {
            fetchAvaxBalance(addr);
          }
        }
      }
    };
    fetchWallet();
  }, []);

  // Fetch AVAX balance from Fuji C-Chain
  const fetchAvaxBalance = async (address: string) => {
    try {
      // Use Avalanche Fuji public API
      const response = await fetch(
        `https://api.avax-test.network/ext/bc/C/rpc`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getBalance',
            params: [address, 'latest']
          })
        }
      );
      const data = await response.json();
      if (data && data.result) {
        // Convert from wei to AVAX
        const avax = parseFloat(BigInt(data.result).toString()) / 1e18;
        setAvaxBalance(avax.toFixed(4));
      } else {
        setAvaxBalance(null);
      }
    } catch (e) {
      setAvaxBalance(null);
    }
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        description: t('walletAddressCopied'),
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('myWallet')}</h1>
          <button
            className="p-2 rounded-full hover:bg-accent transition-colors"
            title="Wallet Settings"
            onClick={() => setShowMnemonic(true)}
          >
            <Settings className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <WalletIcon className="w-6 h-6" />
              AVAX Fuji Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {avaxBalance !== null ? `${avaxBalance} AVAX` : '...'}
                </p>
                <p className="text-muted-foreground">Fuji Testnet</p>
              </div>
              <div className="flex gap-3">
                <Button className="flex items-center gap-2" onClick={() => setShowSend(true)}>
                  <Send className="w-4 h-4" />
                  Send
                </Button>
        {/* Send Modal */}
        {showSend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-bold mb-4">Send AVAX</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSendLoading(true);
                  try {
                    if (!sendTo || !sendAmount || isNaN(Number(sendAmount))) {
                      toast({ description: 'Invalid address or amount', duration: 2000 });
                      setSendLoading(false);
                      return;
                    }
                    // Use ethers.js to send AVAX on Fuji
                    const provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
                    const wallet = ethers.Wallet.fromPhrase(mnemonic).connect(provider);
                    const tx = await wallet.sendTransaction({
                      to: sendTo,
                      value: ethers.parseEther(sendAmount)
                    });
                    await tx.wait();
                    toast({ description: `Sent! TXID: ${tx.hash}`, duration: 4000 });
                    setShowSend(false);
                    setSendTo("");
                    setSendAmount("");
                    fetchAvaxBalance(walletAddress);
                  } catch (err: unknown) {
                    let msg = 'Send failed';
                    if (err && typeof err === 'object' && 'message' in err && typeof (err as Error).message === 'string') {
                      msg = (err as Error).message;
                    }
                    toast({ description: msg, duration: 3000 });
                  } finally {
                    setSendLoading(false);
                  }
                }}
              >
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Recipient Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={sendTo}
                    onChange={e => setSendTo(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Amount (AVAX)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.0001"
                    className="w-full p-2 border rounded"
                    value={sendAmount}
                    onChange={e => setSendAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="w-full" disabled={sendLoading}>{sendLoading ? 'Sending...' : 'Send'}</Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setShowSend(false)} disabled={sendLoading}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}
                <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowReceive(true)}>
                  <Download className="w-4 h-4" />
                  Receive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Receive Modal */}
        {showReceive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full flex flex-col items-center">
              <h2 className="text-lg font-bold mb-2">Receive AVAX</h2>
              <div className="mb-4">
                {walletAddress && (
                  <QRCodeSVG value={walletAddress} size={160} />
                )}
              </div>
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between gap-3 w-full">
                <p className="font-mono text-sm break-all flex-1">{walletAddress || "No wallet address found."}</p>
                <button
                  onClick={handleCopyAddress}
                  className="p-2 hover:bg-accent rounded-md transition-colors flex-shrink-0"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <Button className="w-full mt-4" onClick={() => setShowReceive(false)}>Close</Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">{totalEarned} FC</p>
                  <p className="text-sm text-muted-foreground">{t('totalEarned')}</p>
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
                  <p className="text-sm text-muted-foreground">{t('tierStatus')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recentTransactions')}</CardTitle>
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
            <CardTitle>{t('walletAddress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted rounded-lg flex items-center justify-between gap-3">
              <p className="font-mono text-sm break-all flex-1">{walletAddress || "No wallet address found."}</p>
              <button
                onClick={handleCopyAddress}
                className="p-2 hover:bg-accent rounded-md transition-colors flex-shrink-0"
                title="Copy address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t('autoGeneratedWallet')}
            </p>
          </CardContent>
        </Card>

        {/* Mnemonic Modal */}
        {showMnemonic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-bold mb-2">Your Wallet Mnemonic</h2>
              <div className="relative mb-4">
                <div className="p-3 bg-muted rounded-lg flex items-center justify-between gap-3 min-h-[48px]">
                  <p className="font-mono text-sm break-words flex-1 select-all">{mnemonic || "No mnemonic found."}</p>
                  <button
                    onClick={() => {
                      if (mnemonic) {
                        navigator.clipboard.writeText(mnemonic);
                        toast({ description: 'Mnemonic copied!', duration: 2000 });
                      }
                    }}
                    className="p-2 hover:bg-accent rounded-md transition-colors flex-shrink-0 absolute top-2 right-2"
                    title="Copy mnemonic"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <Button className="w-full" onClick={() => setShowMnemonic(false)}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;