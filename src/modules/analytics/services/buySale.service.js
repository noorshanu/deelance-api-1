const User = require("../../users/user.model");
const Sales = require("../sale.model");
const ArtworkModel = require("../../artworks/model");
const mongoose = require('mongoose')

const nftBuySale = async (body) => {
   try {
     let {
         buyerId,
         buyerWallet,
         contractAddress,
         editionNo,
         priceETH,
         priceUSD,
         sellerWallet,
         artworkName,
     } = body;
     console.log(body);
     const regexName = new RegExp(`^${contractAddress}$`, 'i');
     let saleObj= await Sales.findOne({contractAddress:regexName,editionNo:editionNo})
     if (saleObj) {
        return { data: "Already Sold", status: false, code: 400 };
     }
     const regex = new RegExp(`^${sellerWallet}$`, 'i');
     const userObj = await User.findOne({ wallet: regex }) || null
    //  console.log("userObj", userObj);

     let sellerId = "";
 
     if (userObj && userObj._id) {
         sellerId = mongoose.Types.ObjectId(userObj._id)
     }
     let artworkId = ""
    
     const artObj = await ArtworkModel.findOne({ contractAddress: regexName }) || null
     if (artObj && artObj._id) {
        artworkId = mongoose.Types.ObjectId(artObj._id)
     }
     
     let payload = {
         buyerId: mongoose.Types.ObjectId(buyerId),
         buyerWallet,
         contractAddress,
         editionNo,
         priceETH,
         priceUSD,
         sellerWallet,
         artworkName,
         sellerId: sellerId,
         artworkId:artworkId
     }
    let res=  await Sales.create(payload)
     if (res) {
         return { data: "Sale Added", status: true, code: 200 };
     }else{
         return { data: "Cannot add artwork", status: false, code: 400 };
        }
    } catch (error) {
       return { data: "Cannot add artwork", status: false, code: 500 };
   }
    /* sellerWallet get user info */
}

module.exports = nftBuySale;