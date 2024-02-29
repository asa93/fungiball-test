import { http, createConfig } from "wagmi";


import { base, mainnet, optimism } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";


export const secret = "fgyuhç9999x___2skovzopkdPopopkdOK" // ⚠️ should be in .env 

export const message = "xxx/fungiball/authenticationmessage" // could follow EIP712 format*

export const projectId = "<WALLETCONNECT_PROJECT_ID>";


export const configz = createConfig({
    chains: [mainnet, base],
    connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
    },
});