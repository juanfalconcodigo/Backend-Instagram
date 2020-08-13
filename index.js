const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');
require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.BBDD, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true, useCreateIndex: true }).
then((res) => server()).
catch(console.log);



function server() {
    const server = new ApolloServer({ typeDefs, resolvers });
    server.listen(4004).then(({ url }) => {
        console.log('##########################################');
        console.log(`Server apollo On : ${url}`);
        console.log('##########################################');
    });
}