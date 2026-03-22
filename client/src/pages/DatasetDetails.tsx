import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { useDataset, useAnalyzeDataset } from "@/hooks/use-datasets";
import { useCreatePurchase } from "@/hooks/use-purchases";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, ShieldCheck, MapPin, Maximize, HardDrive, Cpu, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { connectWalletAndLogin } from "@/lib/auth-utils";

export default function DatasetDetails() {
  const { id } = useParams<{ id: string }>();
  const datasetId = parseInt(id || "");
  const { data: dataset, isLoading, error } = useDataset(datasetId);
  
  const { mutate: purchase, isPending: isPurchasing } = useCreatePurchase();
  const { mutate: analyze, isPending: isAnalyzing } = useAnalyzeDataset();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handlePurchase = () => {
    if (!isAuthenticated) {
      void connectWalletAndLogin();
      return;
    }
    
    // Generate a mock transaction hash for the demo
    const mockTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    
    purchase(
      { datasetId, transactionHash: mockTxHash },
      {
        onSuccess: () => {
          toast({
            title: "Purchase Successful",
            description: "Dataset added to your dashboard.",
            variant: "default",
          });
        },
        onError: (err) => {
          toast({
            title: "Purchase Failed",
            description: err.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleAnalyze = () => {
    if (!isAuthenticated) {
      void connectWalletAndLogin();
      return;
    }
    
    analyze(datasetId, {
      onSuccess: () => {
        toast({
          title: "Analysis Complete",
          description: "AI processing finished successfully.",
          variant: "default",
        });
      },
      onError: (err) => {
        toast({
          title: "Analysis Failed",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-destructive">Dataset not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link href="/marketplace">
          <span className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl overflow-hidden glass-card border-primary/20 relative aspect-square lg:aspect-auto lg:h-[600px]">
              <img 
                src={dataset.imageUrl} 
                alt={dataset.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-white">Verified on IPFS</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-display font-bold text-white mb-4">{dataset.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {dataset.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" /> <span className="text-sm">Location</span>
                </div>
                <p className="text-white font-medium">{dataset.location}</p>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Maximize className="w-4 h-4" /> <span className="text-sm">Resolution</span>
                </div>
                <p className="text-white font-medium">{dataset.resolution}</p>
              </div>
              <div className="glass-card p-4 rounded-xl col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <HardDrive className="w-4 h-4" /> <span className="text-sm">IPFS Hash</span>
                </div>
                <p className="text-primary font-mono text-sm break-all">{dataset.ipfsHash}</p>
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="glass-card rounded-xl p-6 mb-10 border-secondary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10" />
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-secondary" /> AI Analysis
                </h3>
                {!dataset.aiAnalysis && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="text-xs font-medium bg-secondary/20 text-secondary-foreground hover:bg-secondary/40 px-3 py-1.5 rounded-md border border-secondary/50 transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? "Scanning..." : "Run Scanner"}
                  </button>
                )}
              </div>
              
              {dataset.aiAnalysis ? (
                <div className="bg-background/50 rounded-lg p-4 font-mono text-sm text-accent-foreground border border-border">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(dataset.aiAnalysis, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Run AI scanner to detect land classes, structural changes, and anomalies in this dataset.
                </p>
              )}
            </div>

            {/* Purchase CTA */}
            <div className="mt-auto glass-card p-6 rounded-2xl border-primary/30 flex items-center justify-between bg-gradient-to-r from-card to-primary/5">
              <div>
                <p className="text-sm text-muted-foreground mb-1">License Price</p>
                <p className="text-3xl font-display font-bold text-white">{dataset.price} <span className="text-lg text-primary">ETH</span></p>
              </div>
              <button
                onClick={handlePurchase}
                disabled={isPurchasing}
                className="px-8 py-4 rounded-xl font-semibold text-primary-foreground bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Acquire Dataset
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
