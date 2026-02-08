const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadImage = async (file, folder, fileName) => {
    try {
        const response = await imagekit.upload({
            file: file.buffer,
            fileName: fileName || file.originalname,
            folder: folder,
            tags: [folder],
            customMetadata: {
                uploadedAt: new Date().toISOString()
            }
        });
        return response;
    } catch (error) {
        throw new Error(`ImageKit upload failed: ${error.message}`);
    }
}

const deleteImage = async (fileId) => {
    try {
        const response = await imagekit.deleteFile(fileId);
        return response;
    } catch (error) {
        throw new Error(`ImageKit deletion failed: ${error.message}`);
    }
}

const getImageUrl = async (fileId, transformations = {}) => {
    try {
        // Fetch file details to get the URL
        const file = await imagekit.getFileDetails(fileId);
        const url = file.url;
        
        // Apply transformations if provided
        if (transformations && Object.keys(transformations).length > 0) {
            const params = new URLSearchParams(transformations);
            return `${url}?${params.toString()}`;
        }
        return url;
    } catch (error) {
        throw new Error(`Failed to get image URL: ${error.message}`);
    }
}

module.exports = {
    uploadImage,
    deleteImage,
    getImageUrl
}