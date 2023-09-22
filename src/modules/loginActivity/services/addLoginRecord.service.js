const LoginActivity = require("../loginActivity.model");
const mongoose = require('mongoose');

const addLoginRecord = async ({ browser, platform, location, userId }) => {
	try {
		const findAllActivityofLogin = await LoginActivity.find({userId: userId});
		if(findAllActivityofLogin){
			const findAllActiveLoginandUpdate = await LoginActivity.updateMany({userId: mongoose.Types.ObjectId(userId)},{active:false});
		}
		const addRes = await LoginActivity.create({ browser, platform, location, userId: mongoose.Types.ObjectId(userId) });		
		if (addRes) {
			return { status: true, code: 201, data: addRes };
		} else {
			return { status: false, code: 500, msg: "Error while adding login record." };
		}
	} catch (error) {

		return { status: false, code: 500, msg: error.message }
	}
};

module.exports = addLoginRecord;