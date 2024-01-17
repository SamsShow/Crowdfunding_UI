// context/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletConfig, setWalletConfig] = useState(null);

  useEffect(() => {
    // Initialize walletConfig when the component mounts
    const initializeWallet = async () => {
      try {
        // Connect to MetaMask wallet
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();

          // Set walletConfig
          setWalletConfig({ provider, signer, address });
        } else {
          console.error("MetaMask not detected");
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
      }
    };

    initializeWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ walletConfig, setWalletConfig }}>
      {children}
    </WalletContext.Provider>
  );
};

const useWalletContext = () => useContext(WalletContext);

export { WalletProvider, useWalletContext };
