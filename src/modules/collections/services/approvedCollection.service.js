const mongoose = require('mongoose');
const CollectionModel = require('../model');
// const uploadAsset = require('../../../utils/contractUtilities/uploadAsset');
// const uploadMetaJSON = require('../../../utils/contractUtilities/createAndUploadMetaJson');
// const { deployNFTContractMarketplace, mintNFT } = require('../../../../scripts/contractUtils');

const approveCollection = async (collectionId) => {
  try {
    const statusRes = await CollectionModel.findOne({ _id: mongoose.Types.ObjectId(collectionId), active: true })

    if (statusRes.progressStatus === 2) {
      /* final update */
      return { data: "Collection Is Already Deployed", status: false, code: 400 }
    } else if (statusRes.progressStatus === 2) {
      /*  Contract Call */
      const res = await deployNFTContractMarketplace({ collectionData: statusRes });
      return { data: res.data, status: res.status, code: res.code }
    } else if (statusRes.progressStatus === 1) {
      /* Upload to IPFS */
      const res = await uploadMetaJSON({ collectionData: statusRes });
      return { data: res.data, status: res.status, code: res.code }
    } else if (statusRes.progressStatus === 0) {
      /* Upload image assest */
      const res = await uploadAsset({ collectionData: statusRes, asset: statusRes.image })
      return { data: res.data, status: res.status, code: res.code }
    }
  }
  catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = approveCollection
