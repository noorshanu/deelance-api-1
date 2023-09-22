const mongoose = require('mongoose');
const TransactionModel = require('../model');

const getSalesReports = async (filter) => {
	try {

		let totalOrders = await TransactionModel.aggregate([
			{ $match: filter },
			{ $count: 'totalOrders' }
		])

		let earningByCurrency = await TransactionModel.aggregate([
			{ $match: filter },
			{
				$group: {
					_id: '$currency',
					totalSell: { $sum: "$price" },
					avgSell:{ $avg: "$price"}
				}
			}
		])

		let weekelyEarning = await TransactionModel.aggregate([
			{ $match: filter },
			{
				$group: {
					_id: {
						week: { $dateToString: { format: "%Y-%V", date: "$createdAt" } },
						currency: "$currency"
					},
					earningsByWeek: { $push: { price: "$price" } }
				}
			},
			{
				$group: {
					_id: "$_id.week",
					earningsByCurrency: {
						$push: {
							currency: "$_id.currency",
							totalEarnings: { $sum: "$earningsByWeek.price" }
						}
					}
				}
			},
			{
				$sort: {
					_id: 1
				}
			}
		]);

		if (totalOrders.length) {
			let reports = { totalOrders: totalOrders[0].totalOrders }
			if (earningByCurrency.length) {
				reports['earningByCurrency'] = earningByCurrency
				if (weekelyEarning.length) {
					reports['weekelyEarning'] = weekelyEarning;
					return { status: true, code: 200, data: reports }
				}
				return { status: true, code: 200, data: reports }
			}
			return { status: true, code: 200, data: reports }
		} else {
			return { status: false, code: 404, msg: "No sales reports found." }
		}
	} catch (error) {
		return { status: false, code: 500, msg: error.message }
	}
};

module.exports = getSalesReports;