const mongoose = require("mongoose")

const ExpenseSchema = new mongoose.Schema({
    name: {type: String, required: true},
    amount: {type: Number, required: true},
    createdAt: {type: Date, default: ()=> Date.now(), immutable: true}
});


module.exports = mongoose.model("Expense", ExpenseSchema)