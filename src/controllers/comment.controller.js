const { User, Publication, Comment } = require("../models/index");
const { GraphQLError } = require('graphql');

async function postComment(comment, idPublication, ctx) {
    const { id } = ctx.user;
    try {
        await Publication.findById(idPublication);
        await User.findById(id);

        const newComment = new Comment({
            idUser: id,
            idPublication: idPublication,
            comment
        });
        newComment.createdAt = newComment._id.getTimestamp();
        const result = await (await newComment.save()).populate('idUser').execPopulate();
        return result;

    } catch (error) {
        throw new GraphQLError(error.message);
    }

}



async function getComments(idPublication) {
    try {
        const publications = await Comment.find().where({ idPublication }).populate('idUser').sort({ createdAt: -1 });
        return publications;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

module.exports = {
    postComment,
    getComments
}