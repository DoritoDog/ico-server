var exports = module.exports = {};

require('dotenv').load();

const Web3 = require('web3');
const tx = require('ethereumjs-tx');
var util = require('ethereumjs-util');
const lightWallet = require('eth-lightwallet');
const BigNumber = require('bignumber.js');
const fs = require('fs');

const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/MalstqsO7EYyOSLpTUdi"));
const txUtils = lightWallet.txutils;

//#region Contract variables
const tokenAddress = '0xD255C2475E0091dA738DfFd1650B438b8eb9ce6D';
const tokenBytecode = fs.readFileSync('./token_bytecode.txt', 'utf8');
const tokenABI = JSON.parse(fs.readFileSync('./token_abi.txt', 'utf8'));

var crowdsaleAddress = '0xab5833a0b481610b3d93b6e80e3fce7a9edba925';
var crowdsaleBytecode = fs.readFileSync('./crowdsale_bytecode.txt', 'utf8');
var crowdsaleABI = JSON.parse(fs.readFileSync('./crowdsale_abi.txt', 'utf8'));
//#endregion

const tokenDefinition = web3.eth.contract(tokenABI);
const token = tokenDefinition.at(tokenAddress);
const crowdsaleDefinition = web3.eth.contract(crowdsaleABI);
const crowdsale = crowdsaleDefinition.at(crowdsaleAddress);

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

function sendTx(from, contractAddress, abi, functionName, args) {
	let options = {
			nonce: web3.toHex(web3.eth.getTransactionCount(from)),
			gasLimit: web3.toHex(800000),
			gasPrice: web3.toHex(20000000000),
			to: contractAddress
	};

	let rawTx = txUtils.functionTx(abi, functionName, args, options);
	return sendRawTx(rawTx, privateKey);
}

module.exports = {
    getBalance: address => {
        let balance = token.balanceOf(address);
        return web3.toDecimal(web3.fromWei(balance, 'ether'));
    },

		/**
		 * The amount is automatically converted into wei.
		 */
    transferTokens: (to, amount, privateKey) => {
        let from = getAddress(privateKey);
				amount = web3.toWei(amount);
				sendTx(from, tokenAddress, tokenABI, 'transfer', [to, amount]);
		},
		
		/**
		 * The amount is automatically converted into wei.
		 */
		mintToken: (target, amount) => {
			amount = web3.toWei(amount);
			sendTx(process.env.OWNER_ADDRESS, tokenAddress, tokenABI, 'mintToken', [target, amount]);
		},

		getContribution: address => {
			var contribution = crowdsale.balances(address);
			return web3.toDecimal(web3.fromWei(contribution, 'ether'));
		},
};