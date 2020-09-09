const { v4: uuidv4 } = require('uuid');
const { awsUploadImage, awsDeleteImage } = require("../utils/aws-upload-image");
const { Publication, User, Follow, Comment, Like } = require('../models');
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


async function getPublicationsFolloweds(ctx) {
    const { user } = ctx;
    const followeds = await Follow.find({ idUser: user.id }).populate('follow');
    let listFolloweds = [];
    for await (const followed of followeds) {
        listFolloweds.push(followed.follow)
    }
    let listPublications = [];
    for await (const data of listFolloweds) {
        const publication = await Publication.find({ idUser: data._id }).populate('idUser').sort({ createdAt: -1 });
        listPublications.push(...publication);
    }
    const result = listPublications.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
}



async function deletePublication(idPublication, ctx) {
    const { user } = ctx;
    try {
        const findPublicationUser = await Publication.findOne({ _id: idPublication }).where('idUser').equals(user.id);
        if (!findPublicationUser) {
            return false;
        }
        const imagePath = findPublicationUser.file.split("/publication/")[1];
        await awsDeleteImage(imagePath);
        await Publication.findByIdAndRemove(findPublicationUser._id);
        await Comment.deleteMany({ idPublication });
        await Like.deleteMany({ idPublication });
        return true;
    } catch (error) {
        console.log(error.message);
        return false
    }
}

module.exports = {
    publish,
    deletePublication,
    getPublications,
    getPublicationsFolloweds
}