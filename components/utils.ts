import { detectEthereumProvider } from "@metamask/detect-provider";
import ethers from "ethers";

export const aaa = () => {
  const provider = await detectEthereumProvider();
  const messageNode = document.getElementById("message");
  if (provider) {
    !provider.isConnected() && (await window.ethereum.enable());
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    let balance = await web3Provider.getBalance(
      window.ethereum.selectedAddress
    );
    messageNode.innerHTML = `<h3 data-cy="title">MetaMask Detected</h3> <p data-cy="address">Your address is: ${
      window.ethereum.selectedAddress
    }</><p data-cy="balance">Balance: ${balance / 1000000000000000000}`;
  } else {
    messageNode.innerText =
      "No MetaMask Detected - please install the extension";
  }

  window.ethereum.on("accountsChanged", (accounts) => {
    window.location.reload();
  });
};
