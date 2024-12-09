const mongoose = require("mongoose")

const DepositSchema = new mongoose.Schema({
    amount: {type: Number, required: true},
    createdAt: {type: Date, default: ()=> Date.now(), immutable: true}
})

module.exports = mongoose.model("Deposit", DepositSchema)