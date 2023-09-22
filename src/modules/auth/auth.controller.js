const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const mongoose = require('mongoose');
const moment = require('moment');
const authService = require('./auth.service');
const tokenService = require('./token.service');
const { sendResponse } = require('../../utils/responseHandler');
const OtpServices = require('../otpVerification/otpVerification.services');
const pick = require('../../utils/pick');
const SettingServices = require('../setting/services')
const User = require('../users/user.model');
const { signUpOtpEmail, forgotOtpEmail } = require('../../utils/sendEmail.services');
const loginActivityServices = require("../loginActivity/services");

const register = catchAsync(async (req, res) => {

	try {
		const { email, password, name, profilePic, nickname, role } = req.body;
		const isEmailTaken = await authService.checkEmail(email)
		if (isEmailTaken) {
			sendResponse(res, httpStatus.BAD_REQUEST, "Email Already taken", null, null);
			return
		}
		let userObj = {
			email,
			password,
			name,
			profilePic,
			nickname,
			role: role ? role : 'user'
		};
		const user = await authService.signup(userObj);
		if (!user.status) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, user.msg);
			return
		}
		else {
			const tokens = await tokenService.generateAuthTokens(user.user);
			res.status(httpStatus.CREATED).send({ user, tokens });
		}

	} catch (error) {
		console.error("Error in registration", error);
	}

});

const signup = catchAsync(async (req, res) => {
	try {
		const { firstName, lastName, email, password, userName ,wallet=""} = req.body;
		const isEmailTaken = await authService.checkEmail(email)
		if (isEmailTaken) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, "Email Already taken");
			return
		}
		let userObj = {
			firstName,
			lastName,
			email,
			password,
			userName,
			role: 'user',
			wallet
		};

		const userRes = await authService.signup(userObj);

		if (!userRes.status) {
			sendResponse(res, httpStatus.BAD_REQUEST, null, userRes.msg);
			return
		}
		let user = userRes.user;

		let generatedOtp = Math.floor(Math.random() * 9000) + 1000;
		const expires = moment().add(5, 'minutes');
		const createOtpdoc = {
			userId: mongoose.Types.ObjectId(user?.id),
			type: "verifyemail",
			email: email,
			otp: generatedOtp,
			expires
		}
		let otpResponse = await OtpServices.sendOtp(createOtpdoc)
		console.log("auth", user?._id);
		await SettingServices.addNotificationSetting(user?.id);
		/* send token link */
     authService.sendVerificationMail(user)
		const tokens = await tokenService.generateAuthTokens(user);
		sendResponse(res, httpStatus.CREATED, { user, tokens, msg: "Verification Link is send to your registered Email Address." }, null)
	} catch (error) {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, "Something went wrong")
	}
});

const adminHost = process.env.adminHost
const login = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	let reqOrigin = req.headers && req.headers.origin ? new URL(req.headers.origin) : ''
	let isAdmin = reqOrigin.host == adminHost
	const user = await authService.loginUserWithEmailAndPassword(email, password, isAdmin);
	/* INFO: Send error message in data directly just like below to maintain consistensy in APP */
	if (user && user.code == 401) {
		sendResponse(res, httpStatus.UNAUTHORIZED, null, user.msg);
		return
	} else if (user && user.code == 403) {
		sendResponse(res, httpStatus.FORBIDDEN, null, user.msg);
		return
	} else if (user && user.code == 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, user.msg);
		return
	}

	const tokens = await tokenService.generateAuthTokens(user.user);
	
	let browserRaw = req.headers["sec-ch-ua"];
	let firstI = browserRaw.search(/;/);
	let browser = browserRaw.slice(0, firstI);
	let platform = req.headers["sec-ch-ua-platform"];
	let userId = user?.user?._id;
	await loginActivityServices.addLoginRecord({browser, platform, location:"", userId})

	sendResponse(res, httpStatus.OK, { user: user.user, tokens }, null);
});

const walletLogin = catchAsync(async (req, res) => {
	const { wallet } = req.body;
	const user = await authService.loginUserWithWallet({wallet});
	/* INFO: Send error message in data directly just like below to maintain consistensy in APP */
	if (user && user.code == 401) {
		sendResponse(res, httpStatus.UNAUTHORIZED, null, user.msg);
		return
	} else if (user && user.code == 403) {
		sendResponse(res, httpStatus.FORBIDDEN, null, user.msg);
		return
	} else if (user && user.code == 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, user.msg);
		return
	}

	const tokens = await tokenService.generateAuthTokens(user.user);
	sendResponse(res, httpStatus.OK, { user: user.user, tokens }, null);
})

const adminLogin = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const user = await authService.adminLoginUserWithEmailAndPassword(email, password);
	const tokens = await tokenService.generateAuthTokens(user);
	sendResponse(res, httpStatus.OK, { user, tokens }, null);
});


const getCurrentUser = catchAsync(async (req, res) => {
	try {
		const { token } = req.body;
		const userRes = await authService.getCurrentUser(token);
		if (userRes.status) {
			res.status(httpStatus.OK).json({
				code: httpStatus.OK,
				status: true,
				data: { userData: userRes.userData, profileData: userRes.profileData }
			});
		} else {
			res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
				code: httpStatus.INTERNAL_SERVER_ERROR,
				status: false,
				data: 'something went wrong',
			});
		}
	} catch (err) {
		res.status(httpStatus.BAD_REQUEST).json({
			status: httpStatus.BAD_REQUEST,
			data: err.message,
		});
	}
});

const logout = catchAsync(async (req, res) => {
	await authService.logout(req.body.refreshToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
	const tokens = await authService.refreshAuth(req.body.refreshToken);
	res.send({ ...tokens });
});

const resendOTP = catchAsync(async (req, res) => {
	let email = req.body.email;
	const isEmail = await authService.checkEmail(email)
	if (isEmail) {
		let generatedOtp = 1234;
		// let generatedOtp = Math.floor(Math.random() * 9000) + 1000;
		const expires = moment().add(5, 'minutes');
		const createOtpdoc = {
			userId: mongoose.Types.ObjectId(isEmail?._id),
			type: "verifyemail",
			email: email,
			otp: generatedOtp,
			expires
		}
		let otpResponse = await OtpServices.sendOtp(createOtpdoc)
    // signUpOtpEmail({to:email, otp: generatedOtp})
		sendResponse(res, httpStatus.OK, "Please check your email, OTP has been sent to your Email to activate your account.", null)
	} else {
		sendResponse(res, httpStatus.NOT_FOUND, null, "Email not found.")
	}
})

const forgotPasswordSendOTP = catchAsync(async (req, res) => {
	let email = req.body.email;
	const isEmail = await authService.checkEmail(email)
	if (isEmail) {
		let generatedOtp = 1234;
		// let generatedOtp = Math.floor(Math.random() * 9000) + 1000;
		const expires = moment().add(5, 'minutes');
		const createOtpdoc = {
			userId: mongoose.Types.ObjectId(isEmail?._id),
			type: "forgotpassword",
			email: email,
			otp: generatedOtp,
			expires
		}
		let otpResponse = await OtpServices.sendOtp(createOtpdoc)
        // signUpOtpEmail({to:email, otp: generatedOtp})
		sendResponse(res, httpStatus.OK, "Please check your email, OTP has been sent to your Email to reset password.", null)
	} else {
		sendResponse(res, httpStatus.NOT_FOUND, null, "Email not found.")
	}
})

const forgotVerifyOtp = catchAsync(async (req, res) => {
	let email = req.body.email;
	let otp = req.body.otp;
	let otpResponse = await OtpServices.forgotVerifyOtp(email, otp);

	if (otpResponse.code == 200) {
		sendResponse(res, httpStatus.OK, otpResponse?.data, null);
	} else if (otpResponse.code == 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, otpResponse.msg);
	} else {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, otpResponse.msg);
	}
});

const resetPassword = catchAsync(async (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	let resetPasswordRes = await authService.resetPassword(email, password);

	if (resetPasswordRes.code == 200) {
		sendResponse(res, httpStatus.OK, resetPasswordRes?.data, null);
	} else if (resetPasswordRes.code == 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, resetPasswordRes.msg);
	} else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, resetPasswordRes.msg);
	}
})

const setNewPassword = catchAsync(async (req, res) => {
	let email = req.body.email;
	let oldpassword = req.body.oldpassword;
	let newpassword = req.body.newpassword;
	let resetPasswordRes = await authService.setNewPassword(email, oldpassword, newpassword);
	if (resetPasswordRes.status) {
		sendResponse(res, httpStatus.OK, resetPasswordRes?.data, null);
	} else {
		sendResponse(res, resetPasswordRes.code == 400 ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR, null, resetPasswordRes.msg);
	}
})

const updatePassword = catchAsync(async (req, res) => {
	let { token, currentPassword, newPassword } = await pick(req.body, ['token', 'currentPassword', 'newPassword']);
	let userRes = await authService.getCurrentUser(token)
	if (!userRes?.status) {
		sendResponse(res, httpStatus.NOT_FOUND, null, 'User not found.')
		return
	}
	let updatePasswordRes = await authService.updatePassword(userRes?.userData, currentPassword, newPassword);
	if (updatePasswordRes.status) {
		sendResponse(res, httpStatus.OK, updatePasswordRes?.data, null);
	} else {
		sendResponse(res,
			updatePasswordRes.code == 404 ? httpStatus.NOT_FOUND :
				updatePasswordRes.code == 401 ? httpStatus.UNAUTHORIZED : httpStatus.INTERNAL_SERVER_ERROR,
			null,
			updatePasswordRes.msg
		);
	}
})

const verifyOtp = catchAsync(async (req, res) => {
	let email = req.body.email;
	let otp = req.body.otp;
	let otpResponse = await OtpServices.verifyOtp(email, otp)

	if (otpResponse.code == 200) {
		sendResponse(res, httpStatus.OK, otpResponse?.data, null);
	} else if (otpResponse.code == 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, otpResponse.msg);
	} else {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, otpResponse.msg);
	}
})
const processGoogleAuth = async (gUser) => {
	let user = null;
	user = await User.findOne({ email: gUser.email, active: true });
	if (!user) {
		let userObj = {
			email: gUser.email,
			password: 'sample@123',
			firstName: gUser.given_name,
			lastName: gUser.family_name,
			role: "user",
			userName: `${gUser.given_name}_${randomStringForUsername(4)}`,
			source: 'google',
			isEmailVerified:true
		};
		user = await authService.createSocialUser(userObj);
	} else if (user?.isBlock) {
		return { socialLink: null };
	}
	const tokens = await tokenService.generateSocialLoginToken(user._id);
	return { socialLink: tokens.socialLink }
}

const socialLogin = catchAsync(async (req, res) => {
	const { token } = await pick(req.body, ["token"]);
	const { sub } = await tokenService.justVerifyToken(token);
	let user = await User.findById(sub);
	user.id = user._id;
	const tokens = await tokenService.generateAuthTokens(user);
	sendResponse(res, httpStatus.OK, { user, tokens }, null);
});

const verifyEmail = catchAsync(async (req, res) => {
	let response = await authService.verifyEmail(req.body.token);
	if(response.status) {
		sendResponse(res, httpStatus.OK, "Success", null);
	}else if (response.code == 403) {
		sendResponse(res, httpStatus.FORBIDDEN, null, response.data);
	} else if (response.code == 404) {
		sendResponse(res, httpStatus.NOT_FOUND, null, response.data);
	}else {
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, "Fail");
	}
  });
module.exports = {
	register,
	login,
	logout,
	refreshTokens,
	getCurrentUser,
	adminLogin,
	signup,
	verifyOtp,
	resendOTP,
	forgotPasswordSendOTP,
	forgotVerifyOtp,
	resetPassword,
	setNewPassword,
	updatePassword,
	processGoogleAuth,
	socialLogin,
	walletLogin,
	verifyEmail
};
function randomStringForUsername(length) {
	var result = '';
	var characters = '0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
