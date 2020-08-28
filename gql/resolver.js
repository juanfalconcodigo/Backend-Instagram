const userController = require('../controllers/user.controller');
const followController = require('../controllers/folllow.controller');

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
        }
    }
}

module.exports = resolvers;