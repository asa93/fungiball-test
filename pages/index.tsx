import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useAccount } from "wagmi";

import { Account } from "./account";
import { WalletOptions } from "./WalletOptions";

import { http, createConfig } from "wagmi";
import { base, mainnet, optimism } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

import { useSignMessage } from "wagmi";

import { projectId, configz } from "./config";

const queryClient = new QueryClient();

function ConnectWallet() {
  const { isConnected } = useAccount();

  if (isConnected) return <Account />;
  return <WalletOptions />;
}

function Sign() {
  const { signMessage, signMessageAsync } = useSignMessage({ configz });
  const { isConnected } = useAccount();

  async function sign() {
    const signature = await signMessageAsync({
      message: "xxx/fungiball/authenticationmessage",
    });
    console.log("signature", signature);
  }

  return isConnected && <button onClick={sign}>Sign message</button>;
}

export default function App() {
  return (
    <WagmiProvider config={configz}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
        <Sign />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
