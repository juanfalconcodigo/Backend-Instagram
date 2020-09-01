const { v4: uuidv4 } = require('uuid');
const awsUploadImage = require("../utils/aws-upload-image");
const { Publication, User } = require('../models');
async function publish(file, ctx) {
    const { id } = ctx.user;
    const { createReadStream, mimetype } = await file;
    const ext = mimetype.split("/")[1];
    const filename = `publication/${uuidv4()}.${ext}`;
    const fileData = createReadStream();
    try {
        const result = await awsUploadImage(fileData, filename);
        const publication = new Publication({
            idUser: id,
            file: result,
            typeFile: mimetype.split("/")[0]
        });
        publication.createdAt = publication._id.getTimestamp();

        publication.save();
        return {
            status: true,
            urlPublish: result
        }

    } catch (error) {
        console.log(error);
        return {
            status: false,
            urlPublish: null
        }
    }
}


async function getPublications(username) {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error("Usuario  no encontrado");
    }

    const publications = await Publication.find().where({ idUser: user._id }).sort({ createdAt: -1 });

    return publications
}

module.exports = {
    publish,
    getPublications
}