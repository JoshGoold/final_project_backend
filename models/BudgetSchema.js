const mongoose = require("mongoose")

const BudgetSchema = new mongoose.Schema({
    name: {type: String, required: true},
    amount: {type: Number, required: true},
    icon: {type: String, required: true},
    retired: {type: Boolean, required: true},
    expenses: [{type: mongoose.SchemaTypes.ObjectId, ref: "Expense"}]
})

module.exports = mongoose.model("Budget", BudgetSchema)