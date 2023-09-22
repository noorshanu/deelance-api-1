const dotenv = require("dotenv");
const path = require("path");
// const fs = require("fs-extra");
const hre = require("hardhat");
// const ethers =  require("ethers");
// var shell = require("shelljs");

// let web3 = require("web3");
let ContractUtils = require("./contractUtils");
// let Events = require("c:/Users/prafu/Downloads/utility-art-api/scripts/events");

dotenv.config({ path: path.join(__dirname, "../.env") });

let owner = process.env.PRIVATE_KEY_ADDRESS;


let deployArtyfactNFTContract = async (factoryAddr) => {
  let res = await ContractUtils.deployNFTContractMarketplace({
    c: 500,
    feeRecipient: process.env.PRIVATE_KEY_ADDRESS,
    factoryAddr: factoryAddr,
    verify: true,
  });
  console.log("Marketplace Contract Address: ", res.address);
  return res.address;
};


const deploy = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const _name ="Vitalik";  
  const _symbol =  "VITALY";
  const maxNftSupply=10;
  const _uri ="https://utility-art.imgix.net/uploads/collectible/7777fe25-d101-4cf9-b41d-6dd1d5cdee39/"
  const usdt=USDT_CONTRACT_ADDRESS;
  const usdc=USDC_CONTRACT_ADDRESS;
  const busd=BUSD_CONTRACT_ADDRESS;
  const arty=ARTY_CONTRACT_ADDRESS;
  const nftPrice=10

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ArtyNFT = await hre.ethers.getContractFactory("ArtyfactNFT"); //Replace with name of your smart contract
  const ArtNFTDeployedContract = await ArtyNFT.deploy( _name,  _symbol,  maxNftSupply,  _uri, usdt, usdc, busd, arty,nftPrice);
  console.log("Deploying Contract done, waiting for confirmation...");
  await ArtNFTDeployedContract.deployed();
  await hre.run("verify:verify", {
    address: ArtNFTDeployedContract.address,
    constructorArguments: [ _name,  _symbol,  maxNftSupply,  _uri, usdt, usdc, busd, arty,nftPrice],
  });
  console.log("Contract Deployed ✓ ");
  console.log("Contract Address:", ArtNFTDeployedContract.address);
}
// deploy()


const ADMIN_WALLET = '0x0A70c7294f9Deffe389E437347ba1B6De531D16C'
const USDT_CONTRACT_ADDRESS = '0x1545D21Af5d240EA25c5e1Ad66b5acdc4DeE802D'
const BUSD_CONTRACT_ADDRESS = '0x5B1D52Cf88053C14B153Ba8Ea0152d093e1E3188'
const USDC_CONTRACT_ADDRESS = '0xab75256Ff788c213B1614E6f1eA34b4523d4cf52'
const ARTY_CONTRACT_ADDRESS = '0xF9915c4d4c2E63cA01336bfc66C74AA22C95Bb21'
const RPCURL = "https://data-seed-prebsc-1-s1.binance.org:8545/"//"https://bsc-dataseed1.binance.org"

const contractAddr = '0xfB63C56962E42e02F77f4B554c82AEcA46A28b54';
const userPrivateKey = '0x6048ac1dc6e678d2007c43e983a0104525cc205fc728585f772b901a2b69df2c'
const userAddress = '0xae6ea2994e82bfb9dc8f774ed51e036da4ad2436'

const initiatePaymentOfToken = async ({ editionId, transactionId, currency, userPrivateKey, userAddress, price }) => {
  const privateKey = userPrivateKey; // Replace with the private key of the sender's wallet
  const fromAddress = userAddress; // Replace with the sender's wallet address
  const toAddress = ADMIN_WALLET; // Replace with the recipient's wallet address
  // Connect to the BSC network
  let currDec = {
    'arty': 6,
    'usdt': 18,
    'bnb': 18,
    'busd': 18
  }
  const provider = new hre.ethers.providers.JsonRpcProvider(RPCURL);
  const wallet = new hre.ethers.Wallet(privateKey, provider);
  const amount = hre.ethers.utils.parseUnits(price.toString(), currDec[currency]); // Replace with the amount of BNB to send
  try {
    if (currency == 'usdt') {
      console.log("usdt sending!");

      const usdtAddress = USDT_CONTRACT_ADDRESS; // Replace with the USDT token contract address
      const usdtAbi = ["function transfer(address to, uint256 amount) returns (bool)"];

      // Create a contract instance for USDT
      const usdtContract = new hre.ethers.Contract(usdtAddress, usdtAbi, wallet);

      // Deduct the amount from the wallet
      const tx = await usdtContract.transfer(toAddress, amount, {
        nonce: undefined
      });
      const wRes = await tx.wait();
      // console.log("usdt tx ===>", tx);
      console.log("Transaction Hash:", tx.hash);
      console.log("wRes", wRes);

    } else if (currency == 'bnb') {
      console.log("BNB sending!");

      // Create a transaction object
      const transaction = {
        to: toAddress,
        value: amount,
      };
      // Send the transaction
      const btx = await wallet.sendTransaction(transaction);
      const wRes = await btx.wait();
      console.log("btx ===>", btx);
      console.log("Transaction Hash:", btx.hash);
      console.log("wRes", wRes);
      // transfer
    } else if (currency == 'arty') {
      console.log("Arty sending!");
      const artyAddress = ARTY_CONTRACT_ADDRESS;
      const artyAbi = ["function transfer(address recipient, uint256 amount) external returns (bool)"];

      // Create a contract instance for USDT
      const artyContract = new hre.ethers.Contract(artyAddress, artyAbi, wallet);

      // Deduct the amount from the wallet
      const tx = await artyContract.transfer('0x1ebE0506DeDCa92370Ec3ae0cE6642F12C28Ca42', amount, {
        nonce: undefined,
        gas
      });
      const wRes = await tx.wait();
      console.log("Transaction Hash:", tx.hash);
      console.log("wRes", wRes);
      console.log("ARTY sent successfully!");
      console.log("From:", fromAddress);
      console.log("To:", '0x1ebE0506DeDCa92370Ec3ae0cE6642F12C28Ca42');
      console.log("Amount:", hre.ethers.utils.formatUnits(amount, currDec[currency]));
    }
  } catch (error) {
    console.log("error", error.message);
  }



}
// initiatePaymentOfToken({
//   editionId: '',
//   transactionId: '',
//   currency: 'arty',
//   userPrivateKey: '0x6048ac1dc6e678d2007c43e983a0104525cc205fc728585f772b901a2b69df2c',
//   userAddress: '0xae6ea2994e82bfb9dc8f774ed51e036da4ad2436',
//   price: 50
// })

async function verifyTransaction(transactionHash) {
  const provider = new hre.ethers.providers.JsonRpcProvider(RPCURL); // Replace with your desired provider URL

  try {
    const transactionReceipt = await provider.getTransactionReceipt(transactionHash);
    console.log(transactionReceipt);
    if (transactionReceipt && transactionReceipt.status === 1) {
      console.log("Transaction is confirmed!");
      console.log("Block number:", transactionReceipt.blockNumber);
    } else {
      console.log("Transaction is still pending or not found.");
    }
  } catch (error) {
    console.log("Error occurred:", error.message);
  }
}
verifyTransaction('0xe92ad7edf1d4a845352174adf67f1610b71fd4fd64f2aeb5db8a20cc2ecef250')