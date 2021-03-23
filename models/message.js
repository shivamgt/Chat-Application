const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    message: { type: String,required: true },
    names: { 
        type: String,
        required: true
    }
});

const Msg = mongoose.model('message',msgSchema);
module.exports = Msg;