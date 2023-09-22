const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const filepath = 'temp';
const ArtworkCollection = require("../../modules/artworks/model");
// const { deployNFTContractMarketplace } = require('../../../scripts/contractUtils');

const uploadMetaJSON = async ({ collectionData, type }) => {
  try {
    const { globSource, create } = await import('ipfs-http-client');

    let collectionDataNew = await ArtworkCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id) })

    console.log("step-------3");
    const projectId = process.env.INFURA_API_KEY;
    const projectSecret = process.env.INFURA_API_KEY_SECRET;
    const jsonDirectoryPath = path.join(__dirname, "../../../", filepath, collectionDataNew._id.toString(), 'json');
    const auth =
      'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth
      }
    })
    const options = {
      wrapWithDirectory: true
    }
    console.log("step-------3.1");
    let fileArr = []
    for await (const file of client.addAll(globSource(jsonDirectoryPath, '**/*'), options)) {
      console.log("files----", file)
      fileArr.push(file)
    }
    const folderItem = fileArr[fileArr.length - 1];
    const folderCID = folderItem.cid ? folderItem.cid.toString() : null;
    if (!folderCID) {
      return { data: "Folder CID Not Created", status: false, code: 500 };
    }

    const deleteDirectory = (directoryPath) => {
      fs.rm(directoryPath, { recursive: true }, (err) => {
        if (err) {
          console.error(`Error deleting directory: ${directoryPath}`, err);
        } else {
          console.log(`Directory deleted: ${directoryPath}`);
        }
      });
    };


    await ArtworkCollection.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(collectionDataNew._id) },
      {
        progressStatus: 3,
        "contractMeta.metaJsonCID": folderCID,
      },
      {
        new: true,
        useFindAndModify: false
      }
    )

    const tempDirectoryPath = path.join(__dirname, "../../../", filepath);
    deleteDirectory(tempDirectoryPath);
    return { data: {msg:"success",artworkId:collectionDataNew._id}, status: true, code: 200 }
  }
  catch (error) {
    console.log("error.message", error.message);
    return { data: error.message, status: false, code: 500 };
  }
};
module.exports = uploadMetaJSON;

