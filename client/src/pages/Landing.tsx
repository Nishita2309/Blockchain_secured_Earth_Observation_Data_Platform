import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Globe2, ShieldCheck, Cpu, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-screen mask-image-gradient" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-primary mb-8 border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Live on Orbital Network
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-tight mb-6">
                Decentralized <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-blue-600 text-glow">
                  Satellite Data Exchange
                </span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                Securely buy, sell, and analyze high-resolution Earth observation data. Powered by IPFS storage and advanced AI analytics.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/marketplace" className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-primary-foreground bg-primary shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                  Explore Marketplace <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="/api/login" className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white glass-card hover:bg-white/5 transition-all duration-300 border-white/10 text-center">
                  Connect Wallet
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-white mb-4">Why OrbitalX?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">The infrastructure for the next generation of geospatial applications.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Globe2 className="w-8 h-8 text-primary" />,
                  title: "Global Coverage",
                  desc: "Access diverse datasets from providers worldwide, cataloged immutably on IPFS."
                },
                {
                  icon: <Cpu className="w-8 h-8 text-secondary" />,
                  title: "AI Analysis",
                  desc: "One-click AI inference to detect land classes, disaster zones, and structural changes."
                },
                {
                  icon: <ShieldCheck className="w-8 h-8 text-accent" />,
                  title: "Verifiable Ownership",
                  desc: "Cryptographically secure purchase records acting as on-chain licensing proofs."
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="glass-card p-8 rounded-2xl hover:border-primary/30 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 font-display">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 text-center text-muted-foreground border-t border-border">
        <p>© 2025 OrbitalX Network. All rights reserved.</p>
      </footer>
    </div>
  );
}
