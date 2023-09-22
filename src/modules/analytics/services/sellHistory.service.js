const Sales = require('../sale.model');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const sellHistory = async () => {
    try {
        const uniqueCreatorCount = await Sales.aggregate([
            { $match: {active:true} },
            {
                $group: {
                  _id:  {
                    $dateToString: {
                      format: "%Y-%m-%d",  // ISO 8601 format with milliseconds and UTC time zone
                      date: "$createdAt"  // Replace "timestamp" with the actual field name
                    }
                  },      
                  totalSalePrice: { $sum: "$priceETH" },  // Calculate the total sale price for each day
                  avgSalePrice: { $avg: "$priceETH" }     // Calculate the average sale price for each day
                }
              }
          ]);

        return { data:uniqueCreatorCount, status: true, code: 200 };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = sellHistory;

