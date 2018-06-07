var exports = module.exports = {};

require('dotenv').load();

const Web3 = require('web3');
const tx = require('ethereumjs-tx');
var util = require('ethereumjs-util');
const lightWallet = require('eth-lightwallet');
const BigNumber = require('bignumber.js');

const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/MalstqsO7EYyOSLpTUdi"));
const txUtils = lightWallet.txutils;

//#region Contract variables
const tokenAddress = '0xD255C2475E0091dA738DfFd1650B438b8eb9ce6D';
const tokenBytecode = '60606040527f43727970746f546f6b656e0000000000000000000000000000000000000000006000906000191690557f43525400000000000000000000000000000000000000000000000000000000006001906000191690556012600260006101000a81548160ff021916908360ff160217905550341561007f57600080fd5b600260009054906101000a900460ff1660ff16600a0a60640260038190555033600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060035460066000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610e7d806101566000396000f3006060604052600436106100c5576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100ca578063095ea7b3146100fb57806318160ddd146101555780631f35bc401461017e57806323b872dd146101cf578063313ce5671461024857806370a082311461027757806379c65068146102c45780638da5cb5b1461031e57806395d89b41146103735780639c1e03a0146103a4578063a9059cbb146103f9578063dd62ed3e14610453575b600080fd5b34156100d557600080fd5b6100dd6104bf565b60405180826000191660001916815260200191505060405180910390f35b341561010657600080fd5b61013b600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506104c5565b604051808215151515815260200191505060405180910390f35b341561016057600080fd5b6101686105b7565b6040518082815260200191505060405180910390f35b341561018957600080fd5b6101b5600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506105c1565b604051808215151515815260200191505060405180910390f35b34156101da57600080fd5b61022e600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506106ac565b604051808215151515815260200191505060405180910390f35b341561025357600080fd5b61025b6107d9565b604051808260ff1660ff16815260200191505060405180910390f35b341561028257600080fd5b6102ae600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506107ec565b6040518082815260200191505060405180910390f35b34156102cf57600080fd5b610304600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610835565b604051808215151515815260200191505060405180910390f35b341561032957600080fd5b610331610a4b565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561037e57600080fd5b610386610a71565b60405180826000191660001916815260200191505060405180910390f35b34156103af57600080fd5b6103b7610a77565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561040457600080fd5b610439600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610a9d565b604051808215151515815260200191505060405180910390f35b341561045e57600080fd5b6104a9600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610ab4565b6040518082815260200191505060405180910390f35b60005481565b600081600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b6000600354905090565b600080600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161480156106575750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561066257600080fd5b81600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060019050919050565b6000600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561073957600080fd5b81600760008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055506107ce848484610b3b565b600190509392505050565b600260009054906101000a900460ff1681565b6000600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806108e05750600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156108eb57600080fd5b81600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555081600360008282540192505081905550600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a38273ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60015481565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000610aaa338484610b3b565b6001905092915050565b6000600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6000808373ffffffffffffffffffffffffffffffffffffffff1614151515610b6257600080fd5b81600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610bb057600080fd5b600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401111515610c3e57600080fd5b600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401905081600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a380600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600660008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401141515610e4b57fe5b505050505600a165627a7a72305820d9eeb206f38e4472226228d95a67426ac0bc522d2d970c6151c0b45917dd07060029';
const tokenABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "spender",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_crowdsale",
				"type": "address"
			}
		],
		"name": "setCrowdsaleAddress",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "from",
				"type": "address"
			},
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "accountAddress",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "target",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mintToken",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "crowdsale",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "account",
				"type": "address"
			},
			{
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"name": "remaining",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "tokenOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	}
];
//#endregion

const tokenDefinition = web3.eth.contract(tokenABI);
const token = tokenDefinition.at(tokenAddress);

function sendRawTx(rawTx, privateKeyString) {
    let privateKey = new Buffer(privateKeyString, 'hex');
    let transaction = new tx(rawTx);

    transaction.sign(privateKey);

    let serializedTx = transaction.serialize().toString('hex');

    web3.eth.sendRawTransaction('0x' + serializedTx, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            return result;
        }
    });
}

function getAddress(privateKey) {
	privateKey = privateKey.startsWith('0x') ? privateKey : '0x' + privateKey;
	var buffer = util.privateToAddress(privateKey);
	return '0x' + buffer.toString('hex');
}

module.exports = {
    getBalance: address => {
        let balance = token.balanceOf(address);
        return web3.toDecimal(web3.fromWei(balance, 'ether'));
    },

    transferTokens: (to, amount, privateKey) => {
        let from = getAddress(privateKey);
        amount = web3.toWei(amount);
        
        let options = {
            nonce: web3.toHex(web3.eth.getTransactionCount(from)),
            gasLimit: web3.toHex(800000),
            gasPrice: web3.toHex(20000000000),
            to: tokenAddress
        };
    
        let rawTx = txUtils.functionTx(tokenABI, 'transfer', [to, amount], options);
        return sendRawTx(rawTx, privateKey);
    },
};