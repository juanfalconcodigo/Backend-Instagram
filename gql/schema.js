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

type Publication{
    id:ID!
    idUser:ID!
    file:String!
    typeFile:String!
    createdAt:Float!
}

type Public{
    status:Boolean
    urlPublish:String
}
type UpdateAvatar{
    status:Boolean
    urlAvatar:String
}

type Comment{
    idUser:User!
    idPublication:String!
    comment:String!
    createdAt:Float!
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

type FeedPublication{
    id:ID!
    idUser:User!
    file:String!
    typeFile:String!
    createdAt:Float!
}

type Query{
    # User Query
    getUsers:[User!]
    getUser(id:ID,username:String):User
    search(search:String):[User]
    isFollow(username:String!):Boolean
    getFollowers(username:String!):[User]
    getFolloweds(username:String!):[User]
    getNotFolloweds:[User!]
    #Publication
    getPublications(username:String):[Publication!]
    getPublicationsFolloweds:[FeedPublication!]
    #getComment
    getComments(idPublication:ID!):[Comment!]
    #getIsLike
    isLike(idPublication:ID!):Boolean
    countLikes(idPublication:ID!):Int
}

type Mutation{
    #User Mutation
    register(input:UserInput!):ResultUser!
    login(input:LoginInput!):ResultToken!
    updateAvatar(file:Upload):UpdateAvatar
    deleteAvatar:Boolean
    updateUser(input:UserUpdateInput):Boolean
    #Follow
    follow(username:String!):Boolean
    unFollow(username:String!):Boolean
    #Publication
    publish(file:Upload):Public
    #Comment
    postComment(comment:String!,idPublication:ID!):Comment
    #Like
    """Added like"""
    postLike(idPublication:ID!):Boolean
    """Delete like"""
    deleteLike(idPublication:ID!):Boolean
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