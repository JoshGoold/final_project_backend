const mongoose = require("mongoose")

const SavingSchema = new mongoose.Schema({
    name: {type: String, required: true},
    goal: {type: Number, required: true},
    saved: {type: Number, default: 0},
    left: {type: Number, default: 0},
    icon: {type: String, required: true},
    retired: {type: Boolean, required: true, default: false},
    deposits: [{type: mongoose.SchemaTypes.ObjectId, ref: "Deposit"}],
    createdAt: {type: Date, default: ()=> Date.now(), immutable: true}
})

module.exports = mongoose.model("Saving", SavingSchema)