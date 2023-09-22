const mongoose = require('mongoose');

const loginActivitySchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true
		},
		browser: {
			type: String,
			default: "",
			required: true,
		},
		platform: {
			type: String,
			default: "",
			required: true,
		},
		location: {
			type: String,
			default: "",
		},
		active: {
			type: Boolean,
			default: true
		},
	},
	{
		timestamps: true,
	}
);

const loginactivity = mongoose.model('loginactivity', loginActivitySchema);

module.exports = loginactivity;
