const mongoose = require("mongoose")

const BudgetSchema = new mongoose.Schema({
    name: {type: String, required: true},
    amount: {type: Number, required: true},
    icon: {type: String, required: true},
    retired: {type: Boolean, default: false},
    expenses: [{type: mongoose.SchemaTypes.ObjectId, ref: "Expense"}],
    createdAt: {type: Date, default: ()=> Date.now(), immutable: true}
})

module.exports = mongoose.model("Budget", BudgetSchema)