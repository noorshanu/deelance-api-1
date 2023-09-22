const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const editionServices = require('../services'); 
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const listEditionById = catchAsync(async (req, res) => {
    
    const {id} = await pick(req.params , ['id'])
    console.log(id);
 
    try {
        const updatedEdition = await editionServices.updatedisListed(id);

        if (updatedEdition) {
            sendResponse(res, httpStatus.OK, updatedEdition, 'Edition listed successfully.');
        } else {
            sendResponse(res, httpStatus.NOT_FOUND, null, 'Edition not found.');
        }
    } catch (error) {
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'An error occurred.');
    }
});

module.exports = listEditionById;
