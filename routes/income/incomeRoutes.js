const Income = require("../../models/IncomeSchema")
const User = require("../../models/UserSchema")
const express = require("express")

const route = express.Router()

route.get("/income", async (req,res)=> {
    const {id} = req.query;
    try {
        const income = await Income.findById(id);
        if(!income){
            return res.status(404).send({Message: "No income found", Success: false})
        }
        return res.send({Message: "Income found", Income: income, Success: true})
    } catch (error) {
        console.error("Error finding income by id: ", error)
        return res.status(500).send({Message: "Error finding income by id", Success: false})
    }
})

route.delete("/income", async (req,res)=> {
    const {incomeid, userid} = req.query;
    try {
        await Income.findByIdAndDelete(incomeid)
        await User.findByIdAndUpdate(userid,{
            $pull: {income: incomeid}
        })
        return res.status(200).send({Message: "Deleted income successfully", Success: true})
    } catch (error) {
        console.error("Error deleting income by id: ", error)
        return res.status(500).send({Message: "Error deleting income by id", Success: false})
    }
})

route.post("/income", async (req,res)=> {
    const {userid, income, month, year} = req.body;
    try {
        const user = await User.findById(userid);
        if(!user){
            return res.status(404).send({Message: "No user found", Success: false})
        }
        const newIncome = new Income({
            income: income,
            month: month,
            year: year
        }) 
        await newIncome.save()
        user.income.push(newIncome._id)
        await user.save()
        return res.status(200).send({Message: "Income created", Success: true})
    } catch (error) {
        console.error("Error creating income: ", error)
        return res.status(500).send({Message: "Error creating income", Success: false})
    }
})

module.exports = route;
