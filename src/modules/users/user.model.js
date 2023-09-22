const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../../models/plugins');
const { roles } = require('../../config/roles');
const counterIncrementor = require('../../utils/counterIncrementer');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    userName: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      // validate(value) {
      //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
      //     throw new Error('Password must contain at least one letter and one number');
      //   }
      // },
      private: true, // used by the toJSON plugin
    },
    country: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    twitterLink: {
      type: String,
    },
    profilePic: {
      type: mongoose.SchemaTypes.String,
      default: 'https://test-env-ci-platform.s3.eu-west-2.amazonaws.com/uploads/1683631172390Group-2829-%281%29.png'
    },
    coverPic: {
      type: mongoose.SchemaTypes.String,
      default: 'https://stardust-asset-qa.s3.ap-southeast-1.amazonaws.com/uploads/1680253836926Banner-IMagres-03.jpg'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    externalLink: {
      type: String,
    },
    source: {
      type: String,
      default: "web"
    },
    isBlock: {
      type: Boolean,
      default: false
    },
    remark: {
      type: String,
    },
    wallet: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: roles,
    },
    active: {
      type: Boolean,
      default: true
    },
    wallet: {
      type: String,
      default:""
    },

  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isUserNameTaken = async function (userName, excludeUserId) {
  const user = await this.findOne({ userName: { $regex: new RegExp(`^${userName}$`) }, _id: { $ne: excludeUserId }, active: true });
  return !!user;
}

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('findOneAndUpdate', async function (next) {
  // console.log("update hook fired")
  const user = this;
  if (user._update && user._update.password) {
    user._update.password = await bcrypt.hash(user._update.password, 8);
  }
  next();
});

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if (user.role) {
    user.seqId = await counterIncrementor('user')
  } else {
    user.seqId = await counterIncrementor(user.role)
  }
  // console.log("user schema checking password value", user.password)
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('users', userSchema);

module.exports = User;
