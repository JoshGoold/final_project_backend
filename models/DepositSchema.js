const mongoose = require("mongoose")

const DepositSchema = new mongoose.Schema({
    amount: {type: Number, required: true}
})

module.exports = mongoose.model("Deposit", DepositSchema)