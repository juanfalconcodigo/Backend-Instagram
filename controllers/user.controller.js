const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { compareSync } = require('bcrypt');
const { ApolloError } = require('apollo-server');
const { awsUploadImage } = require('../utils/aws-upload-image');


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


async function getUser(id, username) {
    let user = null;
    /* ojo enfocarlo en lo que deseas al final solo enviar uno a la vez */
    if (id) user = await User.findById(id);
    if (username) user = await User.findOne({ username });
    if (!user) throw new ApolloError('El usuario no existe', 404);
    return user;
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


async function updateAvatar(file, ctx) {
    const { id } = ctx.user;
    //devuelve una promesa
    const { mimetype, createReadStream } = await file;
    const ext = mimetype.split('/')[1];
    const imageName = `avatar/${id}.${ext}`;
    const fileData = createReadStream();

    try {
        const result = await awsUploadImage(fileData, imageName);
        await User.findByIdAndUpdate(id, { avatar: result });
        return {
            status: true,
            urlAvatar: result
        }
    } catch (error) {
        console.log(error.message);

        return {
            status: false,
            urlAvatar: null
        }
    }
}

async function deleteAvatar(ctx) {
    const { id } = ctx.user;
    try {
        await User.findByIdAndUpdate(id, { avatar: "" });
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

async function updateUser(input, ctx) {
    const { id } = ctx.user;
    try {
        if (input.currentPassword && input.newPassword) {
            const userFind = await User.findById(id);
            const passwordSuccess = await compareSync(input.currentPassword, userFind.password);
            if (!passwordSuccess) throw new Error("Contraseña incorrecta");
            await User.findByIdAndUpdate(id, { password: input.newPassword });
        } else {
            await User.findByIdAndUpdate(id, input);
        }
        return true;
    } catch (error) {
        console.log(error.message);
        return false
    }

}


async function search(search) {
    /*  const regex = new RegExp(search, 'i'); */ //le pasabas el regex
    const users = await User.find({ name: { $regex: search, $options: 'i' } });
    return users;
}

module.exports = {
    register,
    getUsers,
    getUser,
    login,
    updateAvatar,
    deleteAvatar,
    updateUser,
    search
}