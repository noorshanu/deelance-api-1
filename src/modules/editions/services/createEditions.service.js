const mongoose = require('mongoose');
const path = require('path');
const EditionsModel = require('../model');
const fs = require('fs');
const filepath = 'temp';
const ArtworkCollection = require("../../artworks/model");
const uploadMetaJSON = require('../../../utils/contractUtilities/createAndUploadMetaJson');

const createEditions = async ({ collectionData }) => {
    let collectionDataNew = await ArtworkCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id) })

    let metadata = {
        "name": collectionData.name,
        "description": collectionData.desc,
        "external_url": "",
        "image": `https://infura-ipfs.io/ipfs/${collectionDataNew.contractMeta.assetCID}`,
        // "animationUrl": collectionData.contractMeta.asset3DCID,
        "attributes": collectionData?.propsObj && collectionData?.propsObj.length ? collectionData?.propsObj.map(i => {
            return {
                "trait_type": i.name,
                "value": i.value
            }
        }) : []
    }
    const jsonDirectoryPath = path.join(__dirname, "../../../../", filepath, collectionData._id.toString(), 'json');;

    if (!fs.existsSync(jsonDirectoryPath)) {
        fs.mkdirSync(jsonDirectoryPath, { recursive: true });
    }
    const editionBody = []
    for (let ind = 0; ind < collectionData.totalSupply; ind++) {
        let tokenNo = ind + 1;

        let payloadTemp = {
            artworkId: mongoose.Types.ObjectId(collectionData._id),
            editionNo: tokenNo,
            editionJsonData: metadata,
            price: collectionData.price,
            name: collectionData.name,
            source:"created",
            createdBy:collectionData.createdBy,
            assetUrl: collectionData.assetUrl,
            assetType: collectionData.assetType,
            assetMeta:collectionData.assetMeta,
        }
        editionBody.push(payloadTemp)
        let jsonPath = path.join(jsonDirectoryPath, `/${tokenNo}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify({ ...metadata, token: tokenNo }))
    }
    await EditionsModel.insertMany(editionBody)
    await ArtworkCollection.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(collectionData._id) },
        {
            progressStatus: 3,

        },
        {
            new: true,
            useFindAndModify: false
        }
    )

    /* UPLOAD METAJSON TO IPFS */
    const res = await uploadMetaJSON({ collectionData: collectionDataNew })
    return res
}
module.exports = createEditions;