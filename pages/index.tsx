import Head from "next/head";
import Image from "next/image";
import * as ethers from "ethers";
import { useState, useEffect , useCallback} from "react";
import detectEthereumProvider from "@metamask/detect-provider";

export default function Home() {
  const [balance, setBalance] = useState("");
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState();
  const hasWindow = typeof window !== "undefined";

  const handleAccountsChanged = useCallback(
    async(accounts) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log("Please connect to MetaMask.");
      } else if (accounts[0] !== address) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const newBalance = await web3Provider.getBalance(accounts[0]);
        setAddress(accounts[0]);
        setBalance(newBalance);
      }
    },
    [address]
  );

  useEffect(() => {
    const getProvider = async () => {
      const prov = await detectEthereumProvider();
      setProvider(prov);
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("Please connect to MetaMask.");
          } else {
            console.error(err);
          }
        });
    };
    getProvider();
  }, [handleAccountsChanged, hasWindow]);

  return (
    <div id="message">
      {provider && (
        <>
          <h3 data-cy="title">MetaMask Detected</h3>
          <p data-cy="address">Your address is: {address}</p>
          <p data-cy="balance">Balance: ${balance / 1000000000000000000}</p>
        </>
      )}
      {!provider && "No MetaMask Detected - please install the extension"}
    </div>
  );
}
