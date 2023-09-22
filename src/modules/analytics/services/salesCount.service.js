const Sales = require('../sale.model');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const salesCount = async () => {
	try {
		const uniqueCreatorCount = await Sales.aggregate([
			{ $match: { active: true } },
			{
				$group: {
					_id: {
						$dateToString: {
							format: "%Y-%m-%d",  // ISO 8601 format with milliseconds and UTC time zone
							date: "$createdAt"  // Replace "timestamp" with the actual field name
						}
					},
					totalSales: { $sum: 1 },  // Calculate the total sale count for each day
				}
			}
		]);

		return { data: uniqueCreatorCount, status: true, code: 200 };
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = salesCount;

