const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const walletServices = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const addWallets = catchAsync(async (req, res) => {
  const { metamaskWallet, coinbaseWallet, butskiWallet, connectWallet } =
    await pick(req.body, [
      "metamaskWallet",
      "coinbaseWallet",
      "bitskiWallet",
      "connectWallet",
    ]);
  const userId = req.user?.id;
  const walletData = {};
  if (metamaskWallet) {
    walletData.metamaskWallet = metamaskWallet;
  }
  if (coinbaseWallet) {
    walletData.coinbaseWallet = coinbaseWallet;
  }
  if (butskiWallet) {
    walletData.butskiWallet = butskiWallet;
  }
  if (connectWallet) {
    walletData.connectWallet = connectWallet;
  }
  const insertResult = await walletServices.addWallets(userId, walletData);
  if (insertResult.status) {
    sendResponse(res, httpStatus.OK, insertResult.data, null);
  } else {
    if (insertResult.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
    } else if (insertResult.code == 500) {
      sendResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        null,
        insertResult.data
      );
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult);
    }
  }
});

module.exports = addWallets;
