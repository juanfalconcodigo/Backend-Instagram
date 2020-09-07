const { likeController } = require(".");
const { Like } = require("../models");


async function postLike(idPublication, ctx) {
    try {
        const result = await Like.find({ idPublication }).where({ idUser: ctx.user.id });
        if (result.length > 0) {
            return false
        }
        const newLike = new Like({
            idPublication,
            idUser: ctx.user.id
        });

        await newLike.save();
        return true;

    } catch (error) {
        console.log(error.message);
        return false;

    }
}


async function deleteLike(idPublication, ctx) {
    try {
        const result = await Like.findOneAndDelete({ idPublication }).where({ idUser: ctx.user.id });
        return result ? true : false;

    } catch (error) {
        console.log(error.message);
        return false;

    }

}


async function isLike(idPublication, ctx) {

    try {
        const result = await Like.find({ idPublication }).where({ idUser: ctx.user.id });
        if (result.length > 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error.message);
        return false;
    }
}


async function countLikes(idPublication) {
    try {

        const result = await Like.find().where({ idPublication }).countDocuments();
        return result;

    } catch (error) {
        console.log(error.message);
        return 0;
    }
}

module.exports = {
    postLike,
    deleteLike,
    isLike,
    countLikes
}