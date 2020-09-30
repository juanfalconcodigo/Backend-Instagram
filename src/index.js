const express = require('express');
const cors = require('cors')
const compression = require('compression')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');
require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.BBDD, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).
then((res) => server()).
catch(console.log);



function server() {
    const app = express();
    app.use(compression());
    /* app.use(cors({ origin: true, credentials: true })); */
    app.use(function(req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
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
    server.applyMiddleware({ app });
    app.use('/', expressPlayground({
        endpoint: 'graphql'
    }))
    app.listen(process.env.PORT || 4004, (err) => {
        if (err) throw new Error(err);
        console.log('##########################################');
        console.log(`Server apollo On : ${server.graphqlPath}`);
        console.log('##########################################');
    });
}