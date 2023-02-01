const mainnetBadgesAddress = "0x6376e69Ca2e54675A74D3eaDA412657313299ac9";
const mumbaiBadgesAddress = "0xe49e13479aF2FE7B25c5eACfd6C0B27788677BC7";

const mainnetRewardsAddress = "0x9Fc57619ad217A9d74a6eB65b369032B944DA612";
const mumbaiRewardsAddress = "0x791522C659Bd0221Eb7b1D3F11df1c5E2817c286";

const mainnetPOAPAddress = "0xe445D5017c3104cEa78F050Aa10220bF16baB5bD";
const mumbaiPOAPAddress = "0xbcAf8C41256B5F1CC3Cd083160D90c7E2e79f11C";

const REWARDS_ABI: any[] = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenContract",
				"type": "address"
			}
		],
		"name": "ERC1155Created",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_contractOwner",
				"type": "address"
			}
		],
		"name": "deploy",
		"outputs": [
			{
				"internalType": "address",
				"name": "reward",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deployedAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const BADGES_ABI: any[] = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_contractOwner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "baseURI",
				"type": "string"
			}
		],
		"name": "deploy",
		"outputs": [
			{
				"internalType": "address",
				"name": "badge",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenContract",
				"type": "address"
			}
		],
		"name": "ERC721Created",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "deployedAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const POAP_ABI: any[] = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_contractOwner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			}
		],
		"name": "deploy",
		"outputs": [
			{
				"internalType": "address",
				"name": "poap",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenContract",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			}
		],
		"name": "ERC1155Created",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "deployedAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export { mainnetBadgesAddress, mumbaiBadgesAddress, BADGES_ABI, mainnetRewardsAddress, mumbaiRewardsAddress, REWARDS_ABI, mumbaiPOAPAddress,mainnetPOAPAddress, POAP_ABI };
