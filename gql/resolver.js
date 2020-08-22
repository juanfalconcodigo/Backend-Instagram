const userController = require('../controllers/user.controller');

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
        }
    }
}

module.exports = resolvers;