const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: 'First Name is required',
        trim: true
    },

    age: {
        type: Number,
        required: 'Age is required',
        trim: true
    },
    
    
    file: {
        type: String,
        required: 'File',
        trim: true
    }, // s3 link
    
},
    { timestamps: true });

module.exports = mongoose.model('scrutuser', userSchema)