const mongoose = require("mongoose")

const PlanItemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    notes: {type: String},
    price: {type: Number},
    keyword: {type: String, required: true},
    color: {type: String, required: true},
    createdAt: {type: Date, default: ()=> Date.now(), immutable: true}
})

module.exports = mongoose.model("PlanItem", PlanItemSchema)