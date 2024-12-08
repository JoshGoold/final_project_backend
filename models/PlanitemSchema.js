const mongoose = require("mongoose")

const PlanItemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    notes: {type: String},
    price: {type: Number},
    keyword: {type: String, required: true},
    color: {type: String, required: true}
})

module.exports = mongoose.model("PlanItem", PlanItemSchema)