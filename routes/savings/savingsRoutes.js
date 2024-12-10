const Saving = require("../../models/SavingSchema")
const User = require("../../models/UserSchema")
const Deposit = require("../../models/DepositSchema")
const express = require("express")

const route = express.Router()

route.get("/saving", async (req,res)=> {
    const {id} = req.query;
    try {
        const saving = await Saving.findById(id).populate("deposits")
        if(!saving){
            return res.status(404).send({Message: `No saving found with id=${id}`, Success: false})
        }
        return res.status(200).send({Message: "Saving found", Success: true, Saving: saving})
    } catch (error) {
        console.error("Server error occured when finding a saving: ",error)
        return res.status(500).send({Message: "Server error occured when finding a saving", Success: false})
    }
})

route.delete("/saving", async (req,res)=> {
    const {savingid, userid} = req.query;
    try {
        const user = await User.findById(userid)
        if(!user){
            return res.status(404).send({Message: "No user found", Success: false})
        }
        const saving = await Saving.findByIdAndDelete(savingid)
        if(!saving){
            return res.status(404).send({Message: `No saving found with id=${savingid}`})
        }
        user.savings = user.savings.filter(saving => saving.toString() === savingid);
        await user.save();
        return res.status(200).send({Message: "Saving deleted", Success: true})
    } catch (error) {
        console.error("Server error occured when deleting a saving: ",error)
        return res.status(500).send({Message: "Server error occured when deleting a saving", Success: false})
    }
})

route.post("/saving", async (req,res)=> {
    const {name, goal, icon, userid} = req.body;
    try {
        const user = await User.findById(userid)
        if(!user){
            return res.status(404).send({Message: "No user found", Success: false})
        }
        const saving = new Saving({
            name: name,
            goal: goal,
            icon: icon,
        })
        await saving.save();

        user.savings.push(saving._id);
        await user.save()
        return res.status(200).send({Message: "Saving created", Success: true, Saving: saving})
    } catch (error) {
        console.error("Server error while creating saving: ",error)
        return res.status(500).send({Message: "Server error while creating saving", Success: false})
    }
})

route.put("/saving", async (req, res) => {
    const { id } = req.query;
    const { name, goal, saved, retired, icon, left } = req.body;

    try {
        const saving = await Saving.findById(id);
        if (!saving) {
            return res.status(404).send({ Message: "No saving found", Success: false });
        }

        saving.name = name || saving.name;
        saving.goal = goal || saving.goal;
        saving.saved = saved || saving.saved;
        saving.retired = retired !== undefined ? retired : saving.retired;
        saving.icon = icon || saving.icon;
        saving.left = left || saving.left;

        await saving.save();

        return res.status(200).send({ Message: "Updated Successfully", Success: true });
    } catch (error) {
        console.error(`Error while updating saving id ${id}: ${error}`);
        return res.status(500).send({ Message: "Error while updating saving", Success: false });
    }
});

route.post("/deposit", async (req, res) => {
    const { savingid, amount } = req.body;

    if (!savingid || !amount || amount <= 0) {
        return res.status(400).send({ Message: "Invalid input data", Success: false });
    }

    try {
        const saving = await Saving.findById(savingid);
        if (!saving) {
            return res.status(404).send({ Message: "No saving found", Success: false });
        }

        const deposit = new Deposit({ amount: amount });
        await deposit.save();

        saving.deposits.push(deposit._id);
        await saving.save();

        return res.status(201).send({
            Message: "Deposit created successfully",
            Success: true,
            Deposit: deposit,
        });
    } catch (error) {
        console.error(`Error creating new deposit for saving id=${savingid}, error=${error}`);
        return res.status(500).send({
            Message: "Server error creating deposit",
            Success: false,
        });
    }
});

route.delete("/deposit", async (req, res) => {
    const { savingid, depositid } = req.query;

    if (!savingid || !depositid) {
        return res.status(400).send({ Message: "Missing savingid or depositid", Success: false });
    }

    try {
        const deposit = await Deposit.findByIdAndDelete(depositid);
        if (!deposit) {
            return res.status(404).send({ Message: "Deletion failed: no deposit found", Success: false });
        }

        const saving = await Saving.findByIdAndUpdate(
            savingid,
            { $pull: { deposits: depositid } },
            { new: true } // Optional: Return the updated document
        );

        if (!saving) {
            return res.status(404).send({ Message: "No saving found, cannot delete deposit", Success: false });
        }

        return res.status(200).send({ Message: "Deposit deleted successfully", Success: true });
    } catch (error) {
        console.error(`Error deleting deposit for saving id=${savingid} and deposit id=${depositid}, error=${error}`);
        return res.status(500).send({
            Message: "Server error deleting deposit",
            Success: false,
        });
    }
});


module.exports = route;
