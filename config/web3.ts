// @ts-ignore
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE;
let keys = [PRIVATE_KEY];

var mainnetRpc1 = "wss://polygon-mainnet.g.alchemy.com/v2/L910G52NcpI2v3qTQY1P6UgHt5WUqqko";
var mumbaiRpc1 = "https://rpc-mumbai.maticvigil.com";

const WEB3 = async (network: string) => {
	const provider = new HDWalletProvider({
		privateKeys: keys,
		providerOrUrl: network == "mainnet" ? mainnetRpc1 : mumbaiRpc1,
		chainId: network == "mainnet" ? 137 : 80001,
	});
	return new Web3(provider);
};

export { WEB3 };
