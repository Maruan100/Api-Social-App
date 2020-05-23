const fs = require('fs');
const path = require('path');


const imageUtilites = {

    removeFilesOfUploads: (res, filePath, msg) => {
        fs.unlink(filePath, () => {
            return res.status(400).send({ message: msg })
        })
    },

    removeOldImage: (fileName) => {
        let pathFile = 'Uploads/Users/Avatars/' + fileName;
        fs.unlink(pathFile, () => {
            return console.log(true);
        })
    },

    checkExtension: (res, filePath, extension) => {
        if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {
            return true
        }

        else return removeFilesOfUploads(res, filePath, 'Extension no valida');
    },

    checkImage: (res, fileName) => {
        let pathFile = 'Uploads/Users/Avatars/' + fileName;
        fs.exists(pathFile, (exists) => {
            if (exists) return res.sendFile(path.resolve(pathFile))
            else return res.status(404).send({ message: 'No existe la imagen' })
        })
    }

}

module.exports = imageUtilites