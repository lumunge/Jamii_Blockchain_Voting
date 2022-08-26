import Web3 from "web3";
import { getEthereum } from "./getEthereum";

export const getWeb3 = async () => {
  const ethereum = await getEthereum();
  let web3;

  // const provider = new Web3.providers.HttpProvider(
  //   process.env.KOVAN_INFURA_URL
  // );
  // web3 = new Web3(provider);

  if (ethereum) {
    web3 = new Web3(ethereum);
  } else if (window.web3) {
    web3 = window.web3;
  } else {
    // const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
    const provider = new Web3.providers.HttpProvider(
      "http://127.0.0.1:8545" ||
        process.env.GOERLI_INFURA_URL ||
        process.env.RINKEBY_INFURA_URL ||
        process.env.KOVAN_INFURA_URL
    );
    console.log("I AM PROVIDER ", provider);
    web3 = new Web3(provider);

    console.log("I AM WEB 3 ", web3);
  }

  return web3;
};
