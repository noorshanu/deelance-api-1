const httpStatus = require('http-status');
const tokenService = require('./token.service');
const Token = require('../auth/token.model');
const User = require('../users/user.model');
const ApiError = require('../../utils/ApiError');
const { tokenTypes } = require('../../config/tokens');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { adminRoles } = require('../../config/roles');
const { signUpOtpEmail, forgotOtpEmail, welcomeEmail } = require('../../utils/sendEmail.services');
const { email } = require('../../config/config');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const signup = async (userBody, res) => {
  try {
    if (userBody?.wallet) {
      let walletRegex = new RegExp(`^${userBody.wallet}$`, 'i');
      let user = await User.findOne({ wallet: walletRegex });
      if (user) {
        return { msg: "Wallet is already Linked to different Account.", code: 400, status: false }
      }
    }
    if (await User.isUserNameTaken(userBody.userName)) {
      return { msg: "User name is already taken", code: 400, status: false }
    }
    else {
      const user = await User.create(userBody);
      return { code: 201, status: true, user };
    }
  } catch (error) {
    return { msg: error.message, code: 500, status: false }
  }
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const linkToNewAccount = async (userBody, res) => {
  try {
    if (userBody.source == "wallet") {
      const walletResp = await User.findOne({ wallet: userBody.wallet });
      if (walletResp) {
        return { msg: "Wallet is Already linked to different Email", code: 406, status: false }
      }

    } else if (userBody.source == "discord") {
      const discordIdResp = await User.findOne({ discordId: userBody.discordId });
      if (discordIdResp) {
        return { msg: "Discord ID is Already linked to different Email", code: 406, status: false }
      }
    } else {
      return { msg: `Please Provide Source`, code: 400, status: false }
    }

    const user = await User.create(userBody);
    return { code: 201, status: true, user };
  } catch (error) {
    return { msg: `Something went Wrong`, code: 500, status: false }
  }
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password, isAdmin) => {
  let user = await User.findOne({ email, active: true });
  if (user && !(user.role == "user")) {
    return { user: null, msg: "User is not authorized", code: 401 };
  }

  if (!user) {
    return {
      user: null,
      msg: "Email not found. Proceed to signup.",
      code: 404,
    };
  }
  
  if (!user?.isEmailVerified) {
    return {
      user: null,
      msg: user?.remark || "Email is not Verified, Contact Admin",
      code: 403,
    }; 
  }
  if (user?.isBlock) {
    return {
      user: null,
      msg: user?.remark || "Email is Blocked, Contact Admin",
      code: 403,
    };
  }
  if (!(await user.isPasswordMatch(password))) {
    return { user: null, msg: "Incorrect password", code: 401 };
  }
  return { user };
};

/**
 * Login with username and password
 * @param {string} wallet
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithWallet = async ({ wallet }) => {
  console.log("wallet", wallet);
  let walletRegex = new RegExp(`^${wallet}$`, 'i');
  let user = await User.findOne({ wallet: walletRegex, active: true });
  if (!user) {
    return { user: null, msg: 'Not Found', code: 404 }
  }
  if (user?.isBlock) {
    return {
      user: null,
      msg: user?.remark || "Wallet Is  Blocked, Contact Admin",
      code: 403,
    };
  }
  if (user && !(user.role == 'user')) return { user: null, msg: 'User is not authorized', code: 401 };
  return { user };
};

/**
 * Login with username and password
 * @param {string} discordId
 * @returns {Promise<User>}
 */
const loginUserWithDiscordId = async ({ discordId }) => {
  let user = await User.findOne({ discordId, active: true });
  if (!user) {
    return { user: null, msg: 'Not Found', code: 404 }
  }
  if (user && !(user.role == 'user')) return { user: null, msg: 'User is not authorized', code: 401 };
  return { user };
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const adminLoginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email, active: true });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (user && !adminRoles.includes(user.role)) throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not authorized');
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};



/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};


/**
 * getCurrentUser
 * @param {string} token
 * @returns {Promise}
 */
const getCurrentUser = async (token) => {
  try {
    const { user } = await tokenService.verifyToken(token, 'refresh');
    const userData = await User.findOne({ _id: mongoose.Types.ObjectId(user), active: true });
    return { userData, status: true, statusCode: 200 };
  } catch (error) {
    // throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'getCurrentUser failed');
    return { userData: null, profileData: null, isError: 'getCurrentUser failed', status: false, statusCode: 500 }
  }
};

//check Email already exists
const checkEmail = async (email) => {
  return await User.findOne({ email: email, active: true });
};

const linkToExistingAccount = async ({ email, password, wallet, discordId, source }) => {
  try {
    let payload = {}
    let smsg = ``
    if (source == "wallet") {
      const walletResp = await User.findOne({ wallet: wallet });
      if (walletResp) {
        return { msg: "Wallet is Already linked to different Email", code: 406, status: false }
      }
      payload = { wallet: wallet, walletType: 'external' }
      smsg = `Wallet is Successfully Linked to ${email}.`
    } else if (source == "discord") {
      const discordIdResp = await User.findOne({ discordId: discordId });
      if (discordIdResp) {
        return { msg: "discord ID is Already linked to different Email", code: 406, status: false }
      }
      payload = { discordId: discordId }
      smsg = `discord ID is Successfully Linked to ${email}.`
    } else {
      return { msg: `Please Provide Source`, code: 400, status: false }
    }

    let user = await User.findOne({ email, active: true });
    if (user && !(user.role == 'user')) return { user: null, msg: 'User is not authorized', code: 401, status: false };
    if (!user || !(await user.isPasswordMatch(password))) {
      return { user: null, msg: 'Incorrect email or password', code: 400, status: false }
    }

    await User.findOneAndUpdate({ email: email }, payload);
    return { data: smsg, code: 200, status: true }

  } catch (error) {
    return { msg: `Something went Wrong`, code: 500, status: false }
  }
}


const resetPassword = async (email, password) => {
  try {
    const userExists = await checkEmail(email);
    if (userExists) {
      await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userExists._id), active: true }, { password: password }, { new: true })
      return { data: "Password updated successfully.", code: 200, status: true };
    } else {
      return { msg: "User not found.", code: 404, status: false };
    }
  } catch (error) {
    return { msg: `Something went Wrong`, code: 500, status: false };
  }
};

const setNewPassword = async (email, oldpassword, newpassword) => {
  try {
    const filterQuery = { email: email, active: true }
    const userdetails = await User.findOne(filterQuery)
    const updateQuery = { _id: mongoose.Types.ObjectId(userdetails._id) }

    if (!userdetails) {
      return { msg: "User not found", code: 400, status: false };
    }
    const passwordMatches = await bcrypt.compare(oldpassword, userdetails.password);

    if (!passwordMatches) {
      return { msg: "Incorrect old Passowrd", code: 400, status: false };
    } else {
      await User.findOneAndUpdate(updateQuery, { password: newpassword }, { new: true });
      return { data: "Password reset successfully!", code: 200, status: true };
    }
  } catch (error) {
    return { msg: error.message, code: 500, status: false };
  }
}

const updatePassword = async (user, currentPassword, newPassword) => {
  try {
    const passwordMatches = await bcrypt.compare(currentPassword, user?.password);
    if (!passwordMatches) {
      return { msg: "Incorrect current passowrd.", code: 401, status: false };
    } else {
      await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user?._id) }, { password: newPassword }, { new: true });
      return { data: "Password updated successfully.", code: 200, status: true };
    }
  } catch (error) {
    return { msg: error.message, code: 500, status: false };
  }
}

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createSocialUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    return { user: null, status: false, code: 403, data: { msg: 'Email already taken' } };

  }
  if (await User.isUserNameTaken(userBody.username)) {
    return { user: null, status: false, code: 403, data: { msg: 'Username already taken' } };
  }
  const user = await User.create(userBody);
  return user;
};

const sendVerificationMail = async (user) => {
  try {
    const { email } = user
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    const verificationEmailUrl = `${process.env.REMOTE_BASE_URL}/verify-email?token=${verifyEmailToken}`
    console.log("verificationEmailUrl", verificationEmailUrl)
    signUpOtpEmail({ to: email, verifyLink: verificationEmailUrl })
  } catch (error) {
    console.error(error)
  }
}
const getUserById = async (id) => {
  return User.findById(id);
};
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    if (!verifyEmailTokenDoc) {
      return { user: null, status: false, code: 404, data: "Not Found"  };
    }
    const user = await getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      return { user: null, status: false, code: 403, data: "Token Expired"  };
    }
    welcomeEmail({to:user.email})
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await User.findByIdAndUpdate(user.id, { isEmailVerified: true });
    return { data: "Email Verified", code: 200, status: true };
  } catch (error) {
    console.log("error", error.message)
    return { user: null, status: false, code: 500, data: "Something Went Wrong"  };
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  adminLoginUserWithEmailAndPassword,
  getCurrentUser,
  signup,
  checkEmail,
  linkToExistingAccount,
  linkToNewAccount,
  loginUserWithWallet,
  loginUserWithDiscordId,
  resetPassword,
  setNewPassword,
  updatePassword,
  createSocialUser,
  sendVerificationMail,
  verifyEmail
};
