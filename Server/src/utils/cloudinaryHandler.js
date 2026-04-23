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


const DeleteProductFromCloudinary=async(productName)=>{
    try{

        const folderPath = `roomify/Products/${productName}`;

        await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'image' });

        await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'raw' });

        await cloudinary.api.delete_folder(folderPath);

        return true;

    }catch(e){
        console.log(`Can't delete product with name ${productName}`,e);
        return false
    }
}




module.exports={uploudToCloudinary,DeleteProductFromCloudinary}