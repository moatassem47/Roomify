const cloudinary=require("../config/cloudinary")
const fs = require("fs").promises;


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


module.exports={uploudToCloudinary,DeleteProductFromCloudinary}