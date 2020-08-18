const userController = require('../controllers/user.controller');

const resolvers = {
    Query: {
        async getUsers() {
            return userController.getUsers();
        },
        async getUser(_, { id, username }) {
            return userController.getUser(id, username);
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
        }
    }
}

module.exports = resolvers;