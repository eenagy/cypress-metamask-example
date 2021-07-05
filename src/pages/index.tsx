import * as ethers from "ethers";
import { useState, useEffect, useCallback } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

function requestAccess(ethereum: any, handleAccountsChanged: (accounts: string[]) => void) {
  ethereum
  //@ts-ignore
  .request({ method: "eth_requestAccounts" })
  .then(handleAccountsChanged)
  .catch((err: any) => {
    console.log('metamask request access')
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      console.log("Please connect to MetaMask.");
    } else {
      console.error(err);
    }
  });
}

export default function Home() {
  const [balance, setBalance] = useState("");
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState<unknown>();
  const hasWindow = typeof window !== "undefined";

  const handleAccountsChanged = useCallback(
    async (accounts) => {
      if (accounts.length === 0) {
        setBalance("")
        setAddress("")
      } else if (accounts[0] !== address) {
        if (window.ethereum) {
          const web3Provider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          const newBalance = await web3Provider.getBalance(accounts[0]);
          setAddress(accounts[0]);
          setBalance(newBalance.toString());
        }
      }
    },
    [address]
  );
  const connect = useCallback(() => {
    if (window.ethereum) {
      requestAccess(window.ethereum, handleAccountsChanged)
    }
  }, [handleAccountsChanged]);

  useEffect(() => {
    const init = async () => {
      if(hasWindow){
        const prov = await detectEthereumProvider();
        setProvider(prov);
        if(window.ethereum){
           //@ts-ignore
          window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
      }
    };
    init();
    return () =>{
      if(window && window.ethereum){
        //@ts-ignore
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  }, [handleAccountsChanged, hasWindow]);

  return (
    <div id="message">
      {provider && (
        <>
          <h3 data-cy="title">MetaMask Detected</h3>
          <p data-cy="address">Your address is: {address || "-"}</p>
          <p data-cy="balance">Balance: {balance || "-"}</p>
          <button data-cy="connect" onClick={connect}>
            connect
          </button>
        </>
      )}
      {!provider && <h3 data-cy="title">No MetaMask Detected - please install the extension!</h3>}
    </div>
  );
}
