const notificationModel = require('../notification.model');
const mongoose = require('mongoose');

/**
 * Create a Series
 * @param {Object} favouriteData
 * @returns {Promise<Favourite>}
 */
const addNotificationService = async ({
    receiverId,
    type,
    message
}) => {
    try {

        const notification = await notificationModel.create({
            receiverId,
            type,
            message
        });
        if (notification) {
            return { status: true, code: 201, notification };
        } else {
            return { status: false, code: 400, data: "notification not added" };
        }
    } catch (error) {
        console.log(error);
        return { status: false, code: 500, msg: error.message }
    }
};

module.exports = addNotificationService;