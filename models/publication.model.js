const { Schema, model } = require('mongoose');

const publicationSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        required: [true, 'El id de usuario es necesario'],
        ref: 'user'
    },
    file: {
        type: String,
        required: [true, 'File es necesario'],
        trim: true
    },
    typeFile: {
        type: String,
        required: [true, 'Tipo de archivo es necesario'],
        trim: true
    },
    createdAt: {
        type: Number,
        required: false
    }
});

module.exports = model('publication', publicationSchema);