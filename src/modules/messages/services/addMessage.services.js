const mongoose = require('mongoose');
const MESSAGE = require('../messages.model')


const addMessage = async (data) => {
    try {
        const addResult = await MESSAGE.create({ ...data });
        if (addResult) {
            return { data: data, status: true, code: 200 };
        }
        else {
            return { data: "Cannot add message", status: false, code: 400 };
        }
    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addMessage
