import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// ✅ Define Educhain manually
const educhain = {
  id: 656476,
  name: "Educhain Testnet",
  network: "Educhain",
  rpcUrls: {
    default: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://opencampus-codex.blockscout.com/" },
  },
  nativeCurrency: {
    name: "Educhain Token",
    symbol: "EDU",
    decimals: 18,
  },
} as const;

export const config = getDefaultConfig({
  appName: "VeriLearn",
  projectId: "524f02fa0ec9ff9495578a3cd795f699", 
  chains: [educhain],
  transports: {
    [educhain.id]: http("https://rpc.open-campus-codex.gelato.digital"),
  },
});