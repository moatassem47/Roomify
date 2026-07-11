const cloudinary=require("../config/cloudinary")
const fs = require("fs").promises;

const uploadBufferToCloudinary = (fileBuffer, productName, is3DModel = false) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `roomify/Products/${productName}`,
                resource_type: is3DModel ? "raw" : "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result.secure_url);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

const uploudToCloudinary = async (localFilePath, productName, is3DModel = false) => {
    try {
        if (!localFilePath) return null;

    
        
        const options = {
            folder: `roomify/Products/${productName}`,
            resource_type: is3DModel ? "raw" : "image"
        };

        const uploadResult = await cloudinary.uploader.upload(localFilePath, options);

        
        await fs.unlink(localFilePath);

        return uploadResult.secure_url;
        
    } catch (e) {
        console.error("Cloudinary Upload Error:", e);
        
        try { 
            await fs.unlink(localFilePath); 
        } catch (err) {

        }
        
        return null;
    }
};

const uploadFileToCloudinary = async (file, productName, is3DModel = false) => {
    try {
        if (!file) return null;

        if (file.buffer) {
            return await uploadBufferToCloudinary(file.buffer, productName, is3DModel);
        }

        return await uploudToCloudinary(file.path, productName, is3DModel);
    } catch (e) {
        console.error("Cloudinary Upload Error:", e);
        return null;
    }
};




const DeleteProductFromCloudinary = async (productName) => {
    try {
        const folderPath = `roomify/Products/${productName}`;
        
        
        const searchResult = await cloudinary.search
            .expression(`folder:"${folderPath}"`)
            .max_results(10) 
            .execute();
            
        
        if (searchResult.resources && searchResult.resources.length > 0) {
            for (const file of searchResult.resources) {
                
                await cloudinary.uploader.destroy(file.public_id, { 
                    resource_type: file.resource_type 
                });
            }
        }

        
        await cloudinary.api.delete_folder(folderPath);

        return true;

    } catch (e) {
        console.error(`Cloudinary Delete Error:`, e.error ? e.error : e);
        return false;
    }
}


module.exports={uploudToCloudinary,uploadFileToCloudinary,DeleteProductFromCloudinary}
