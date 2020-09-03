const { commentController, followController, publicationController, userController } = require('../controllers');

const resolvers = {
    Query: {
        async getUsers() {
            return userController.getUsers();
        },
        async getUser(_, { id, username }) {
            return userController.getUser(id, username);
        },
        async search(_, { search }) {
            return userController.search(search);
        },
        async isFollow(_, { username }, ctx) {
            return followController.isFollow(username, ctx);
        },
        async getFollowers(_, { username }) {
            return followController.getFollowers(username);
        },
        async getFolloweds(_, { username }) {
            return followController.getFolloweds(username);
        },
        async getPublications(_, { username }) {
            return publicationController.getPublications(username);
        },
        async getComments(_, { idPublication }) {
            return commentController.getComments(idPublication);
        }
    },
    Mutation: {
        async register(_, { input }) {
            return userController.register(input);
        },
        async login(_, { input }) {
            return userController.login(input);
        },
        async updateAvatar(_, { file }, ctx) {
            return userController.updateAvatar(file, ctx);
        },
        async deleteAvatar(_, __, ctx) {
            return userController.deleteAvatar(ctx);
        },
        async updateUser(_, { input }, ctx) {
            return userController.updateUser(input, ctx);
        },
        async follow(_, { username }, ctx) {
            return followController.follow(username, ctx);
        },
        async unFollow(_, { username }, ctx) {
            return followController.unFollow(username, ctx);
        },
        async publish(_, { file }, ctx) {
            return publicationController.publish(file, ctx);
        },
        async postComment(_, { comment, idPublication }, ctx) {
            return commentController.postComment(comment, idPublication, ctx)
        }
    }
}

module.exports = resolvers;