const { Schema, model } = require('mongoose');

const likeSchema = new Schema({
    idPublication: {
        type: Schema.Types.ObjectId,
        ref: 'publication',
        required: [true, 'Es necesario el id de la publicación']
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Es necesario el id del usario']
    }
});


module.exports = model('like', likeSchema);