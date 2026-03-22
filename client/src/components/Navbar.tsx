import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Satellite, Menu, X, Rocket } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, isAuthenticated, isLoading, loginWithWallet } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleConnectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum || !ethereum.request) {
        alert("MetaMask (or a compatible Web3 wallet) was not detected in this browser.");
        return;
      }

      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletAddress = accounts[0];
      if (!walletAddress) {
        return;
      }

      await loginWithWallet(walletAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    ...(isAuthenticated ? [
      { href: "/upload", label: "Upload Dataset" },
      { href: "/dashboard", label: "Dashboard" }
    ] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b-0 border-b-card-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300">
              <Satellite className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-2xl tracking-wide text-glow text-white">
              Orbital<span className="text-primary">X</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-border pl-6">
              {!isLoading && (
                isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/50 flex items-center justify-center overflow-hidden">
                        {user?.profileImageUrl ? (
                          <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-secondary-foreground">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href="/api/logout"
                      className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors duration-200"
                    >
                      Logout
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleConnectWallet}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300"
                  >
                    <Rocket className="w-4 h-4" />
                    Connect Wallet
                  </button>
                )
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="border-t border-border pt-4 mt-2">
                {!isLoading && (
                  isAuthenticated ? (
                    <a
                      href="/api/logout"
                      className="block w-full text-center px-4 py-3 rounded-lg font-medium text-destructive border border-destructive/30 hover:bg-destructive/10"
                    >
                      Logout
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleConnectWallet();
                      }}
                      className="block w-full text-center px-4 py-3 rounded-lg font-medium text-primary bg-primary/10 border border-primary/30"
                    >
                      Connect Wallet
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
