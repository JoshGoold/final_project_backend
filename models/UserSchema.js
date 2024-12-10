const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    budgets: [{type: mongoose.SchemaTypes.ObjectId, ref: "Budget"}],
    income: [{type: mongoose.SchemaTypes.ObjectId, ref: "Income"}],
    plans: [{type: mongoose.SchemaTypes.ObjectId, ref: "Plan"}],
    savings: [{type: mongoose.SchemaTypes.ObjectId, ref: "Saving"}],   
})

module.exports = mongoose.model("User", UserSchema)