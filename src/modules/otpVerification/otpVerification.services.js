const Otp = require('./model');
const User = require('../users/user.model')
const mongoose = require('mongoose');


/**
 * Create a otp
 * @param {Object} otpDoc
 * @returns {Promise<User>}
 */
const sendOtp = async (otpDoc) => {
	const response = await Otp.create(otpDoc);
	return response;
};

const verifyOtp = async (email, otp) => {
	try {
		const currentDate = new Date()
		const emailUser = await Otp.findOne({ email, type: "verifyemail" }).sort({ _id: -1 }) || null;

		if (emailUser) {
			if (otp == emailUser.otp && currentDate < emailUser.expires) {
				let filterQuery = { email, active: true }
				const updatedResult = await User.findOneAndUpdate(filterQuery, { isEmailVerified: true }, { new: true })
				if (updatedResult) {
					await Otp.deleteOne({ _id: mongoose.Types.ObjectId(emailUser._id), type: "verifyemail" })
					return { data: "Email is Verified. You can proceed to login.", status: true, code: 200 };
				}
				else {
					return { msg: "User not found", status: false, code: 404 };
				}
			}
			else {
				return { msg: "Invalid OTP", status: false, code: 404 };
			}
		}
		else {
			return { msg: "No OTP found for this email", status: false, code: 404 };
		}
	} catch (error) {
		return { msg: `Something went Wrong`, code: 500, status: false }
	}
}

const forgotVerifyOtp = async (email, otp) => {
	try {
		const currentDate = new Date()
		const emailUser = await Otp.findOne({ email, type: "forgotpassword" }).sort({ _id: -1 }) || null;

		if (emailUser) {
			if (otp == emailUser.otp && currentDate < emailUser.expires) {
				let filterQuery = { email, active: true }
				const updatedResult = await User.findOneAndUpdate(filterQuery, { isEmailVerified: true }, { new: true })
				if (updatedResult) {
					await Otp.deleteOne({ _id: mongoose.Types.ObjectId(emailUser._id), type: "forgotpassword" })
					return { data: "OTP is verified", status: true, code: 200 };
				}
				else {
					return { msg: "User not found", status: false, code: 404 };
				}
			}
			else {
				return { msg: "Invalid OTP", status: false, code: 404 };
			}
		}
		else {
			return { msg: "No OTP found for this email", status: false, code: 404 };
		}
	} catch (error) {
		return { msg: `Something went Wrong`, code: 500, status: false }
	}
}

module.exports = {
	sendOtp,
	verifyOtp,
	forgotVerifyOtp
}