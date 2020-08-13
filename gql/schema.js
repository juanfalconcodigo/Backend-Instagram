const { gql } = require('apollo-server');


const typeDefs = gql `
type User{
    id:ID!
    name:String!
    username:String!
    email:String!
    avatar:String
    siteWeb:String
    description:String
    password:String!
    createdAt:Float!
}

input UserInput{
    name:String!
    username:String!
    email:String!
    # Sensitive Case
    password:String!
}

type Query{
    # User Query
    getUser:[User!]
}

type Mutation{
    #User Mutation
    register(input:UserInput!):ResultUser!
    login(input:LoginInput!):ResultToken!
}

input LoginInput{
    email:String!
    password:String!
}


type ResultUser{
    status:Boolean!
    message:String!
    user:User
}

type ResultToken{
    status: Boolean!
    message: String!
    user: User
    token: String
}
`;

module.exports = typeDefs;