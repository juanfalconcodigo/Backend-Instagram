const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'El id del usuario es necesario']
    },
    idPublication: {
        type: Schema.Types.ObjectId,
        ref: 'publication',
        required: [true, 'El id de la publicación es necesario']
    },
    comment: {
        type: String,
        trim: true,
        required: [true, 'El comentario es necesario']
    },
    createdAt: {
        type: Number,
        required: false
    }

});


module.exports = model('comment', commentSchema);