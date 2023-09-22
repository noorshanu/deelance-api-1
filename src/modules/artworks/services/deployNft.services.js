const mongoose = require('mongoose');
const ArtworkModel = require('../model');
const uploadAsset = require('../../../utils/contractUtilities/uploadAsset');
const uploadMetaJSON = require('../../../utils/contractUtilities/createAndUploadMetaJson');
// const { deployNFTContractMarketplace } = require('../../../../scripts/contractUtils');
const { createEditions } = require('../../editions/services');

const deployNft = async ({artworkId,userId}) => {
  try {
    const statusRes = await ArtworkModel.findById({ _id: artworkId, active: true })

    if (statusRes.progressStatus === 3) {
      /* final update */
      return { data: "Artwork Is Already Deployed", status: false, code: 400 }
    }  else if (statusRes.progressStatus === 2) {
      /* Upload to IPFS */
      const res = await uploadMetaJSON({ collectionData: statusRes });
      return { data: res.data, status: res.status, code: res.code }
    } else if (statusRes.progressStatus === 1) {
      /* Upload to IPFS */
      const res = await createEditions({ collectionData: statusRes });
      return { data: res.data, status: res.status, code: res.code }
    }else if (statusRes.progressStatus === 0) {
      /* Upload image assest */
      const res = await uploadAsset({ collectionData: statusRes })
      return { data: res.data, status: res.status, code: res.code }
    }
  }
  catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = deployNft
