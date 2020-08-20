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

type UpdateAvatar{
    status:Boolean
    urlAvatar:String
}

input UserInput{
    name:String!
    username:String!
    email:String!
    # Sensitive Case
    password:String!
}

input UserUpdateInput{
    name:String
    email:String
    currentPassword:String
    newPassword:String
    siteWeb:String
    description:String
}

type Query{
    # User Query
    getUsers:[User!]
    getUser(id:ID,username:String):User
}

type Mutation{
    #User Mutation
    register(input:UserInput!):ResultUser!
    login(input:LoginInput!):ResultToken!
    updateAvatar(file:Upload):UpdateAvatar
    deleteAvatar:Boolean
    updateUser(input:UserUpdateInput):Boolean
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