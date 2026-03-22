import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DatasetCard } from "@/components/DatasetCard";
import { useAuth } from "@/hooks/use-auth";
import { useDatasets } from "@/hooks/use-datasets";
import { usePurchases } from "@/hooks/use-purchases";
import { LayoutDashboard, ShoppingBag, HardDrive, Loader2, Key } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { connectWalletAndLogin } from "@/lib/auth-utils";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"purchases" | "uploads">("purchases");

  const { data: allDatasets, isLoading: isDatasetsLoading } = useDatasets();
  const { data: purchases, isLoading: isPurchasesLoading } = usePurchases();

  // Redirect if not auth
  if (!isAuthLoading && !isAuthenticated) {
    void connectWalletAndLogin();
    return null;
  }

  const isLoading = isDatasetsLoading || isPurchasesLoading;

  // Filter datasets based on user
  const userUploads = allDatasets?.filter(d => d.ownerId === user?.id) || [];
  
  // Find purchased datasets
  const purchasedDatasetIds = new Set(purchases?.map(p => p.datasetId) || []);
  const userPurchasedDatasets = allDatasets?.filter(d => purchasedDatasetIds.has(d.id)) || [];

  const displayDatasets = activeTab === "purchases" ? userPurchasedDatasets : userUploads;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/50 flex items-center justify-center overflow-hidden">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-secondary-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              Welcome, {user?.firstName || user?.email?.split('@')[0] || 'Explorer'}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Key className="w-4 h-4" /> ID: {user?.id?.substring(0, 8)}...
            </p>
          </div>
        </div>

        <div className="mb-8 border-b border-border">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("purchases")}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === "purchases" ? "text-primary" : "text-muted-foreground hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Acquired Assets
              </div>
              {activeTab === "purchases" && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("uploads")}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === "uploads" ? "text-secondary" : "text-muted-foreground hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" /> My Uploads
              </div>
              {activeTab === "uploads" && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-t-full shadow-[0_0_10px_rgba(138,43,226,0.5)]" />
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : displayDatasets.length === 0 ? (
          <div className="text-center py-32 glass-card rounded-2xl border-dashed">
            <LayoutDashboard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-white mb-2">No datasets found</h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === "purchases" 
                ? "You haven't acquired any satellite data yet." 
                : "You haven't listed any datasets on the marketplace."}
            </p>
            <Link href={activeTab === "purchases" ? "/marketplace" : "/upload"}>
              <span className="inline-block px-6 py-3 rounded-lg font-medium text-sm bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                {activeTab === "purchases" ? "Explore Marketplace" : "Upload Dataset"}
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayDatasets.map((dataset, index) => (
              <DatasetCard key={dataset.id} dataset={dataset} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
