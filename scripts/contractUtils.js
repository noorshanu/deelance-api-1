const hre = require("hardhat");
const Edition = require("../src/modules/editions/editions.model");
const mongoose = require('mongoose');

function wait(milisec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, milisec);
  });
}

async function checkBalance() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Deploying contracts with the account - check balance:",
    deployer.address
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());
}


async function deployNFTContractMarketplace({ collectionData }) {
return
  try {
    const CONTRACT_NAME = "DeelanceNFT"
    let collectionDataNew = await WeaponCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id) })
    
    let _args = [collectionDataNew.name, collectionDataNew.tokenTracker,
    collectionDataNew.totalSupply,
    `ipfs.io/ipfs/${collectionDataNew.contractMeta.metaJsonCID}/`, usdt, usdc, busd, arty, collectionDataNew.price]
    console.log("Compile Marketplace Contract now... ");
    await hre.run("compile");
    console.log("Compile Marketplace Contract Done ✓ ");
    console.log("Deploying Marketplace Contract now");
    const UtilityArtMarketplace = await hre.ethers.getContractFactory(CONTRACT_NAME);
    const ArtyMarketplaceDeployedContract = await UtilityArtMarketplace.deploy(..._args);
    console.log("Deployed Contract , waiting for confirmation...");
    await ArtyMarketplaceDeployedContract.deployed();
    await hre.run("verify:verify", {
      address: ArtyMarketplaceDeployedContract.address,
      constructorArguments: _args,
    });
    console.log("Marketplace Contract Deployed ✓ ");
    console.log("Marketplace Contract Address:", ArtyMarketplaceDeployedContract.address);

  
      await ArtworkCollection.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(collectionData._id) },
        {
          progressStatus: 5,
          contractAddress: ArtyMarketplaceDeployedContract.address
        },
        {
          new: true,
          useFindAndModify: false
        })
        await Edition.updateMany({ weaponId: mongoose.Types.ObjectId(collectionData._id) }, { contractAddress: ArtyMarketplaceDeployedContract.address })
    
    const res = await mintNFT({ collectionData: collectionDataNew._doc, type })
    return res
  } catch (error) {
    console.log("error.message", error.message);
    return { data: error.message, status: false, code: 500 };
  }
}


async function mintNFT({ collectionData, type,qty=1 }) {
  try {
    let  collectionDataNew = await ArtworkCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id) })
   
    const CONTRACT_NAME = "DeelanceNFT"
    console.log("NFT mint Started");
    const UtilityArtNFTContract = await hre.ethers.getContractFactory(CONTRACT_NAME);
    const UtilityArtNFTDeployedContract = UtilityArtNFTContract.attach(
      collectionDataNew.contractAddress
    );
    let res = await UtilityArtNFTDeployedContract.mint(qty);
    const receipt = await res.wait();

    if (receipt.status == 1) {
      //Calculate latest Minted NFT's

      // console.log("receipt", receipt);
      //  await AvatarCollection.findOneAndUpdate(
      //    { _id: mongoose.Types.ObjectId(collectionData._id) },
      //    {
      //      progressStatus: 6,
      //    },
      //    {
      //      new: true,
      //      useFindAndModify: false
      //    }
      //  )
      return { data: "Mint Successfully with receipt id" + receipt.transactionHash, status: true, code: 200 }

    } else {

    }
  } catch (error) {
    console.log("error.message",error.message);
    return { data: error.message, status: false, code: 500 };

  }

}

async function totalSupply(data) {
  let { contractAddress } = data;
  const [deployer] = await hre.ethers.getSigners();
  console.log("View Total Supply:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("contractAddress : ", contractAddress);
  const UtilityArtNFTContract = await hre.ethers.getContractFactory(
    "UtilityArtNFT"
  );
  const UtilityArtNFTDeployedContract = UtilityArtNFTContract.attach(
    contractAddress
  );
  let res = await UtilityArtNFTDeployedContract.totalSupply();
  return res.toNumber();
}

module.exports = {
  deployNFTContractMarketplace,
  mintNFT,
  totalSupply,
};
