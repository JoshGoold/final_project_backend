const mongoose = require("mongoose")

const PlanSchema = new mongoose.Schema({
    name: {type: String, required: true},
    icon: {type: String, required: true},
    notes: {type: String},
    retired: {type: Boolean, required: true, default: false},
    planitems: [{type: mongoose.SchemaTypes.ObjectId, ref: "PlanItem"}],
    createdAt: {type: Date, default: ()=> Date.now(), immutable: true}
})

module.exports = mongoose.model("Plan", PlanSchema)