const { ethers } = require("ethers");
const getReceipts = async (txnHash) => {
    const RPC_URL = `https://goerli.infura.io/v3/598218e659ac4533b5a468c35759ec86`;//+process.env.POLYGONSCAN_API_KEY
    try {
        const Provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const receiptObj = await Provider.getTransactionReceipt(txnHash);
        await receiptObj.wait()
        if (receiptObj && Object.keys(receiptObj)) {
            console.log("receiptObj",receiptObj?.logs[0]?.address);
            return receiptObj?.logs[0]?.address ?? "";
        } else {
            return ""
        }
    } catch (error) {
        return ""
    }
}

module.exports = {
    getReceipts
}