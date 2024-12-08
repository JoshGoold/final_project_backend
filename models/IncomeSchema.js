const mongoose = require("mongoose")

const IncomeSchema = new mongoose.Schema({
    income: {type: Number, required: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true}
})

module.exports = mongoose.model("Income", IncomeSchema)