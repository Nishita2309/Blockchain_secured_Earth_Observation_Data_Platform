import { Navbar } from "@/components/Navbar";
import { DatasetCard } from "@/components/DatasetCard";
import { useDatasets } from "@/hooks/use-datasets";
import { Search, Filter, Loader2 } from "lucide-react";

export default function Marketplace() {
  const { data: datasets, isLoading, error } = useDatasets();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Discover and acquire premium Earth observation data.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search location..."
                className="pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all w-full md:w-64"
              />
            </div>
            <button className="p-2.5 rounded-xl glass-card text-muted-foreground hover:text-white hover:border-primary/50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-32 glass-card rounded-2xl border-destructive/20">
            <p className="text-destructive font-medium text-lg">Failed to load datasets.</p>
          </div>
        ) : datasets?.length === 0 ? (
          <div className="text-center py-32 glass-card rounded-2xl">
            <p className="text-muted-foreground font-medium text-lg">No datasets found. Be the first to upload one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {datasets?.map((dataset, index) => (
              <DatasetCard key={dataset.id} dataset={dataset} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
