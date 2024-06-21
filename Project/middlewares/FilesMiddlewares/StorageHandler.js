const fs = require('fs');
const path = require('path');
const multer = require('multer');

class StorageHandler {
    static baseDirectory = './public/uploads';

    static createMulterStorage(subFolder) {
        const uploadFolderPath = path.join(this.baseDirectory, subFolder);
        if (!fs.existsSync(uploadFolderPath)) {
            fs.mkdirSync(uploadFolderPath, { recursive: true });
        }
        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadFolderPath);
            },
            filename: (req, file, cb) => {
                cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
            }
        });
    }

    static saveBase64Image(base64Image, imageName, subFolder) {
        return new Promise((resolve, reject) => {
            try {
                const uploadFolderPath = path.join(this.baseDirectory, subFolder);
                if (!fs.existsSync(uploadFolderPath)) {
                    fs.mkdirSync(uploadFolderPath, { recursive: true });
                }
                const imageBuffer = Buffer.from(base64Image.split(';base64,').pop(), 'base64');
                const imagePath = path.join(uploadFolderPath, imageName);
                fs.writeFileSync(imagePath, imageBuffer, { encoding: null });
                resolve(path.join('uploads', subFolder, imageName));
            } catch (error) {
                reject(error);
            }
        });
    }

    static getMulterMiddleware(subFolder) {
        const storage = this.createMulterStorage(subFolder);
        return multer({ storage: storage }).single('image');
    }
}

module.exports = StorageHandler;
