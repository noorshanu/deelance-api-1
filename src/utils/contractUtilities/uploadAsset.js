const mongoose = require('mongoose');
const ArtworkCollection = require("../../modules/artworks/model");
const { default: axios } = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const { createEditions } = require('../../modules/editions/services');
const filepath = 'temp';

const uploadAsset = async ({ collectionData }) => {

    /* upload Image Asset */
    const projectId = process.env.INFURA_API_KEY;
    const apiUrl = `https://ipfs.infura.io:5001/api/v0/add?pin=true&cid-version=0&project=${projectId}`;
    const projectSecret = process.env.INFURA_API_KEY_SECRET;
    const imageDirectoryPath = path.join(__dirname, "../../../", filepath, collectionData._id.toString(), 'image');

    if (!fs.existsSync(imageDirectoryPath)) {
        fs.mkdirSync(imageDirectoryPath, { recursive: true });
    }

    // const downloadImageandUploadToIpfs = async () => {
    const response = await axios({
        url: collectionData.assetUrl,
        method: 'GET',
        responseType: 'stream'
    });
    const ext = `.png`
    const filename = `${Date.now()}${ext}`; // Use a unique filename based on the timestamp
    const fileFullPath = path.join(imageDirectoryPath, filename);

    await new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(fileFullPath))
            .on('error', reject)
            .on('finish', () => resolve(fileFullPath));
    });

    if (response.status == 200) {
        const fileContent = fs.readFileSync(fileFullPath);
        // Prepare the request payload
        const formData = new FormData();
        formData.append('file', fileContent);

        // Generate a random boundary string
        const boundary = formData.getBoundary();

        // Set the authorization header
        const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');
        const headers = {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Authorization': auth
        };

        // Send the file upload request to Infura
        try {
            const response = await axios.post(apiUrl, formData, {
                headers: headers
            })
            console.log("response.data.Hash", response.data);
            const ipfsHash = response.data.Hash;
            console.log('File uploaded successfully. IPFS hash:', ipfsHash);
            await ArtworkCollection.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(collectionData._id) },
                {
                    "contractMeta.assetCID": ipfsHash,
                    progressStatus: 1
                },
                {
                    new: true,
                    useFindAndModify: false
                }
            )

            collectionData = { ...collectionData._doc }
            const res = await createEditions({ collectionData})
            return res
        } catch (error) {

            console.error('Error uploading file to Infura:', error.message);
            return { status: false, data: error.message, code: 500 }
        }
    } else {
        return { status: false, data: "Something Went Wrong", code: 500 }
    }

};

module.exports = uploadAsset;
