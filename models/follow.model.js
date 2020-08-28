const { Schema, model } = require('mongoose');

const followSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Ingrese el id del usuario']
    },
    follow: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Ingrese el id del usuario']
    },
    createdAt: {
        type: Number,
        required: false
    }
});

module.exports = model('follow', followSchema);