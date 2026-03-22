export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

async function loginWithWalletRequest(walletAddress: string) {
  const response = await fetch("/api/auth/wallet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ walletAddress }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function connectWalletAndLogin(): Promise<void> {
  const { ethereum } = window as any;
  if (!ethereum || !ethereum.request) {
    throw new Error("MetaMask (or a compatible Web3 wallet) was not detected in this browser.");
  }

  const accounts: string[] = await ethereum.request({
    method: "eth_requestAccounts",
  });

  const walletAddress = accounts[0];
  if (!walletAddress) {
    throw new Error("No wallet address returned by the provider.");
  }

  await loginWithWalletRequest(walletAddress);
}

// Trigger wallet connect/login with optional toast
export function redirectToLogin(
  toast?: (options: { title: string; description: string; variant: string }) => void
) {
  if (toast) {
    toast({
      title: "Unauthorized",
      description: "Please connect your wallet to continue.",
      variant: "destructive",
    });
  }
  setTimeout(() => {
    void connectWalletAndLogin().catch((error) => {
      console.error("Failed to connect wallet:", error);
    });
  }, 500);
}
