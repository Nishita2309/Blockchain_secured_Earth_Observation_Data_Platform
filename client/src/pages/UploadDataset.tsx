import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { useCreateDataset } from "@/hooks/use-datasets";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { connectWalletAndLogin } from "@/lib/auth-utils";

export default function UploadDataset() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { mutate: createDataset, isPending } = useCreateDataset();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    resolution: "30cm/pixel",
    location: "",
    price: "",
    imageUrl: "",
    ipfsHash: "Qm" + Array.from({length: 44}, () => Math.floor(Math.random()*16).toString(16)).join(''), // Mock IPFS hash
  });

  // Redirect if not auth
  if (!isAuthLoading && !isAuthenticated) {
    void connectWalletAndLogin();
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createDataset(
      {
        ...formData,
        price: formData.price, // handled as string decimal in schema
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Upload Successful",
            description: "Your dataset is now live on the marketplace.",
          });
          setLocation(`/dataset/${data.id}`);
        },
        onError: (err) => {
          toast({
            title: "Upload Failed",
            description: err.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
              <UploadCloud className="w-8 h-8 text-primary" /> Upload Dataset
            </h1>
            <p className="text-muted-foreground">List your satellite imagery on the decentralized exchange.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Dataset Title</label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Amazon Rainforest Deforestation 2024"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Description</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Detailed description of the dataset..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Resolution</label>
                  <input
                    required
                    name="resolution"
                    value={formData.resolution}
                    onChange={handleChange}
                    placeholder="e.g. 50cm/pixel"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Location Covered</label>
                  <input
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Brazil, South America"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Price (ETH)</label>
                  <input
                    required
                    type="number"
                    step="0.001"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.05"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Preview Image URL</label>
                  <input
                    required
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Mock IPFS Hash</label>
                <input
                  disabled
                  value={formData.ipfsHash}
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-muted-foreground opacity-70 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-2">In production, actual files would be pinned to IPFS.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 rounded-xl font-semibold text-primary-foreground bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Mint Dataset Listing</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
