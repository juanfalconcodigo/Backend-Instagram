const { User, Follow } = require("../models/index")

async function follow(username, ctx) {
    //falta validar que solo siga a 1
    const userFind = await User.findOne({ username });
    if (!userFind) throw new Error('User not found');
    try {
        const newFollow = new Follow({
            idUser: ctx.user.id,
            follow: userFind._id
        });
        newFollow.createdAt = newFollow._id.getTimestamp();
        await newFollow.save();
        return true;
    } catch (error) {
        console.log(error.message)
        return false;
    }
}

async function isFollow(username, ctx) {
    const userFind = await User.findOne({ username });
    if (!userFind) throw new Error('User not found');
    const user = await Follow.find({ idUser: ctx.user.id }).where('follow').equals(userFind._id);
    if (user.length > 0) {
        return true
    }
    return false
}


async function unFollow(username, ctx) {
    const userFind = await User.findOne({ username });
    if (!userFind) throw new Error('User not found');
    const user = await Follow.deleteOne({ idUser: ctx.user.id }).where('follow').equals(userFind._id);
    if (user.deletedCount > 0) {
        return true;
    }
    return false;
}

async function getFollowers(username) {
    const userFind = await User.findOne({ username });
    if (!userFind) throw new Error('User not found');
    const followers = await Follow.find({ follow: userFind.id }).populate('idUser');
    let followersList = [];
    for await (const follow of followers) {
        followersList.push(follow.idUser);
    }
    return followersList;
}


async function getFolloweds(username) {
    const userFind = await User.findOne({ username });
    if (!userFind) throw new Error('User not found');
    const users = await Follow.find({ idUser: userFind._id }).populate('follow');
    let followedsList = [];
    for await (const user of users) {
        followedsList.push(user.follow)
    }
    return followedsList;
}

async function getNotFolloweds(ctx) {
    const { user } = ctx;

    try {
        const users = await User.find().limit(50);
        let result = [];
        for await (const e of users) {
            const userFind = await Follow.findOne({ idUser: user.id }).where('follow').equals(e._id);
            if (!userFind) {
                if (e._id.toString() !== user.id.toString()) {
                    result.push(e)
                }
            }
        }
        return result;
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    follow,
    isFollow,
    unFollow,
    getFollowers,
    getFolloweds,
    getNotFolloweds
}