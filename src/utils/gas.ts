import axios from "axios";

export const getGas = async () => {
	var response = await axios.get("https://gasstation-mainnet.matic.network/");
	var data = response.data;
	return data.fastest;
};
