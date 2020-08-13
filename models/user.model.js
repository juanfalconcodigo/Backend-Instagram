const { Schema, model } = require('mongoose');
const { genSalt, hashSync, genSaltSync } = require('bcrypt');
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatar: {
        type: String,
        required: false,
        trim: true
    },
    siteWeb: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Number,
        required: false
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    const salt = genSaltSync(10);
    user.password = hashSync(user.password, salt);
    next();
});

module.exports = model('user', userSchema);