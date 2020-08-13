const userController = require('../controllers/user.controller');

const resolvers = {
    Query: {
        async getUser() {
            return userController.getUsers();
        }
    },
    Mutation: {
        async register(_, { input }) {
            return userController.register(input);
        },
        async login(_, { input }) {
            return userController.login(input);
        }
    }
}

module.exports = resolvers;