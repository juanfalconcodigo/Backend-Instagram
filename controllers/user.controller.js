const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { compareSync } = require('bcrypt');


async function register(input) {
    let { name, username, email, password } = input;

    name = name.toLowerCase();
    username = username.toLowerCase();
    email = email.toLowerCase();

    const findUserName = await User.findOne({ username });
    if (findUserName) {
        return {
            status: false,
            message: 'Username is exists',
            user: null
        }
    }

    const findUserEmail = await User.findOne({ email });
    if (findUserEmail) {
        return {
            status: false,
            message: 'Email is exists',
            user: null
        }
    }


    try {
        const newUser = new User({ name, username, email, password });
        newUser.createdAt = newUser._id.getTimestamp();
        const user = await newUser.save();
        return {
            status: true,
            message: 'User created',
            user: user
        }
    } catch (error) {
        return {
            status: false,
            message: error.message,
            user: null
        }

    }

}


async function getUsers() {
    const users = await User.find({});
    return users;
}

async function login(input) {
    const { email, password } = input;
    const userFind = await User.findOne({ email: email.toLowerCase() });

    if (!userFind) {
        return {
            status: false,
            message: 'Email* or password is not found',
            user: null,
            token: null
        }
    }

    if (!compareSync(password, userFind.password)) {
        return {
            status: false,
            message: 'Email or password* is not found',
            user: null,
            token: null
        }
    }

    try {
        const token = await jwt.sign({
            id: userFind.id,
            name: userFind.name,
            username: userFind.username,
            email: userFind.email
        }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });

        return {
            status: true,
            message: 'Login success',
            user: userFind,
            token
        }
    } catch (error) {
        return {
            status: false,
            message: error.message,
            user: null,
            token: null
        }
    }
}


module.exports = {
    register,
    getUsers,
    login
}