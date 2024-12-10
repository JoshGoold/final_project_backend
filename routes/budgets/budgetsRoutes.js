const Budget = require("../../models/BudgetSchema")
const User = require("../../models/UserSchema")
const Expense = require("../../models/ExpenseSchema")
const express = require("express")

const route = express.Router()

route.get("/budget", async (req,res)=> {
    const {id} = req.query;
    try {
        const budget = await Budget.findById(id).populate("expenses").lean();
        if(!budget){
            return res.status(404).send({Message: "No budget found", Success: false})
        }
        return res.status(200).send({Message: "Budget found", Success: true, Budget: budget})
    } catch (error) {
        console.error("Error finding budget: ",error)
        return res.status(500).send({Message: "Error finding budget", Success: false})
    }
})

route.delete("/budget", async (req,res)=> {
    const {budgetid, userid} = req.query;
    try {
        await Budget.findByIdAndDelete(budgetid)
        await User.findByIdAndUpdate(userid, {
            $pull: {budgets: budgetid}
        })
        return res.status(200).send({Message: "Budget deleted successfully", Success: true})
    } catch (error) {
        console.error("Error deleting budget: ",error)
        return res.status(500).send({Message: "Error deleting budget", Success: false})
    }
})

route.post("/budget", async (req,res)=> {
    const {name, amount, icon, userid} = req.body;
    try {
        const user = await User.findById(userid);
        if(!user){
            return res.status(404).send({Message: "No user found", Success: false})
        }
        const budget = new Budget({
            name: name,
            amount: amount,
            icon: icon,
        })
        await budget.save()
        user.budgets.push(budget._id)
        await user.save()
        return res.status(200).send({Message: "Budget created successfully", Success: true, Budget: budget})
    } catch (error) {
        console.error("Error creating budget: ",error)
        return res.status(500).send({Message: "Error creating budget", Success: false})
    }
})

route.put("/budget", async (req,res)=>{
    const {name, amount, icon, retired, budgetid} = req.body;
    try {
        const budget = await Budget.findById(budgetid)
        if(!budget){
            return res.status(404).send({Message: "No budget found", Success: false})
        }
        budget.name = name || budget.name;
        budget.amount = amount || budget.amount;
        budget.icon = icon || budget.icon;
        budget.retired = retired !== undefined ? retired : budget.retired;
        await budget.save()
        return res.status(200).send({Message: "Budget updated", Success: true})
    } catch (error) {
        console.error("Error updating budget: ",error)
        return res.status(500).send({Message: "Error updating budget", Success: false})
    }
})

route.post("/expense", async (req,res)=>{
    const {budgetid, name, amount} = req.body;
    try {
        const budget = await Budget.findById(budgetid);
        if(!budget){
            return res.status(404).send({Message: "No budget found", Success: false})
        }
        const expense = new Expense({
            name: name,
            amount: amount
        })
        await expense.save()
        budget.expenses.push(expense._id)
        await budget.save()
        return res.status(200).send({Message: "Expense created successfully", Success: true, Expense: expense})
    } catch (error) {
        console.error("Error creating expense: ",error)
        return res.status(500).send({Message: "Error creating expense", Success: false})
    }
})

route.delete("/expense", async (req,res)=>{
    const {budgetid, expenseid} = req.query;
    try {
        await Budget.findByIdAndUpdate(budgetid, {
            $pull: {expenses: expenseid}
        })
        await Expense.findByIdAndDelete(expenseid)
        return res.status(200).send({Message: "Expense deleted successfully", Success: true})
    } catch (error) {
        console.error("Error deleting expense: ",error)
        return res.status(500).send({Message: "Error deleting expense", Success: false})
    }
})

module.exports = route;