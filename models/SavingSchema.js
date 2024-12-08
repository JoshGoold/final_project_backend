const mongoose = require("mongoose")

const SavingSchema = new mongoose.Schema({
    name: {type: String, required: true},
    goal: {type: Number, required: true},
    saved: {type: Number, required: true, default: 0},
    left: {type: Number, required: true},
    icon: {type: String, required: true},
    retired: {type: Boolean, required: true, default: false},
    deposits: [{type: mongoose.SchemaTypes.ObjectId, ref: "Deposit"}]
})

module.exports = mongoose.model("Saving", SavingSchema)