import { Link } from "wouter";
import { type Dataset } from "@shared/schema";
import { MapPin, Maximize, Cpu } from "lucide-react";
import { motion } from "framer-motion";

interface DatasetCardProps {
  dataset: Dataset;
  index?: number;
}

export function DatasetCard({ dataset, index = 0 }: DatasetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/dataset/${dataset.id}`}>
        <div className="block group h-full glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer">
          <div className="relative aspect-video overflow-hidden bg-muted">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
            <img
              src={dataset.imageUrl}
              alt={dataset.title}
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80";
              }}
            />
            <div className="absolute top-4 right-4 z-20">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/50 backdrop-blur-md border border-white/10 text-white">
                {dataset.price} ETH
              </span>
            </div>
            {dataset.aiAnalysis && (
              <div className="absolute top-4 left-4 z-20">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary/80 backdrop-blur-md border border-secondary text-white">
                  <Cpu className="w-3 h-3" /> AI Scanned
                </span>
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="font-display font-semibold text-lg text-white group-hover:text-primary transition-colors line-clamp-1">
              {dataset.title}
            </h3>
            
            <div className="mt-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary/70" />
                <span className="truncate">{dataset.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Maximize className="w-4 h-4 text-primary/70" />
                <span>{dataset.resolution} Resolution</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">
                IPFS: {dataset.ipfsHash.substring(0, 8)}...{dataset.ipfsHash.substring(dataset.ipfsHash.length - 4)}
              </span>
              <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
