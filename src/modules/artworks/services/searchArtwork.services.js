const ArtworkModel = require('../model');
const CollectionModel = require('../../collections/model');
const mongoose = require("mongoose")
const searchArtwork = async ({ keyword }) => {
    /* collections */
    if(!keyword){
    return {status:true,data:[],code:200}
    }
    const aggQuery = [
        {
            $match: {
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { content: { $regex: keyword, $options: "i" } }
                ]
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                assetUrl:1,
                collectionName: { $literal: "artworks" }
            }
        }
    ]
    // const aggColQuery = [
    //     {
    //         $match: {
    //             $or: [
    //                 { name: { $regex: keyword, $options: "i" } },
    //                 { token: { $regex: keyword, $options: "i" } }
    //             ]
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 1,
    //             name: 1,
    //             collectionName: { $literal: "collections" }
    //         }
    //     }
    // ]

    const [ artworkResults] = await Promise.all([
        // CollectionModel.aggregate(aggColQuery),
        ArtworkModel.aggregate(aggQuery).limit(10),
    ])
    const searchResults = [ ...artworkResults];
    // const result = await  ArtworkModel.aggregate((aggQuery))
    return { status: true, data: searchResults, code: 200 }
}
module.exports = searchArtwork