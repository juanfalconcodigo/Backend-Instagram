const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');
require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.BBDD, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).
then((res) => server()).
catch(console.log);



function server() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const token = req.headers.authorization;

            if (token) {
                try {
                    const user = jwt.verify(
                        token.replace("Bearer ", ""),
                        process.env.JWT_SECRET
                    );
                    return {
                        user,
                    };
                } catch (error) {
                    console.log("#### ERROR ####");
                    console.log(error.message);
                    throw new Error("Token invalido");
                }
            }
        },
    });
    server.listen(4004).then(({ url }) => {
        console.log('##########################################');
        console.log(`Server apollo On : ${url}`);
        console.log('##########################################');
    });
}