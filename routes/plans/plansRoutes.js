const Plan = require("../../models/PlanSchema")
const User = require("../../models/UserSchema")
const PlanItem = require("../../models/PlanitemSchema")
const express = require("express")

const route = express.Router()

route.get("/plan", async (req,res)=> {
    const {id} = req.query;
    if (!id) {
        return res.status(400).send({ Message: "Plan ID is required", Success: false });
    }
    try {
         const plan = await Plan.findById(id).populate("planitems").lean();
         if(!plan){
            return res.status(404).send({Message: "No plan found", Success: false})
         }
         return res.status(200).send({Message: "Plan found", Plan: plan, Success: true})
    } catch (error) {
        console.error(`Server error occured while locating plan by id: `, error)
        return res.status(500).send({Message: "Server error occured while locating plan by id", Success: false})
    }
})

route.delete("/plan", async (req,res)=> {
    const {planid, userid} = req.query;
    if (!planid || !userid) {
        return res.status(400).send({ Message: "Plan ID and User ID are required", Success: false });
    }

    try {
        await Plan.findByIdAndDelete(planid)
        await User.findByIdAndUpdate(userid,{
            $pull : {plans: planid}
        })
        return res.status(200).send({Message: "Plan deleted successfully", Success: true})
    } catch (error) {
        console.error("Error deleting plan", error);
        return res.status(500).send({Message: "Error deleting plan", Success: false})
    }
})

route.post("/plan", async (req, res) => {
    const { name, icon, notes, userid } = req.body;

    if (!userid || !name) {
        return res.status(400).send({ Message: "User ID and name are required", Success: false });
    }

    try {
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).send({ Message: "No user found", Success: false });
        }

        const plan = new Plan({
            name: name,
            icon: icon,
            notes: notes,
        });

        await plan.save();
        user.plans.push(plan._id);
        await user.save();

        return res.status(201).send({ Message: "Plan created successfully", Success: true, Plan: plan });
    } catch (error) {
        console.error("Error creating plan", error);
        return res.status(500).send({ Message: "Server error creating plan", Success: false });
    }
});


route.put("/plan", async (req, res) => {
    const { name, icon, notes, retired, id } = req.body;

    if (!id) {
        return res.status(400).send({ Message: "Plan ID is required", Success: false });
    }

    try {
        const plan = await Plan.findById(id);
        if (!plan) {
            return res.status(404).send({ Message: "No plan found", Success: false });
        }

        plan.name = name || plan.name;
        plan.icon = icon || plan.icon;
        plan.notes = notes || plan.notes;
        plan.retired = retired !== undefined ? retired : plan.retired;

        await plan.save();
        return res.status(200).send({ Message: "Plan updated successfully", Success: true, Plan: plan });
    } catch (error) {
        console.error("Error updating plan", error);
        return res.status(500).send({ Message: "Server error updating plan", Success: false });
    }
});


route.post("/planitem", async (req,res)=>{
    const {planid, name, notes, price, keyword, color} = req.body;
    if (!planid || !name) {
        return res.status(400).send({ Message: "Plan ID and name are required", Success: false });
    }
    try {
        const plan = await Plan.findById(planid);
        if(!plan){
            return res.status(404).send({Message: "No plan found", Success: false})
        }
        const planitem = new PlanItem({
            name: name,
            notes: notes,
            price: price,
            keyword: keyword,
            color: color
        })
        await planitem.save();
        plan.planitems.push(planitem._id);
        await plan.save();
        return res.status(200).send({Message: "Plan item created", Success: true})
    } catch (error) {
        console.error("Error creating plan item", error);
        return res.status(500).send({Message: "Error creating plan item", Success: false})
    }
})

route.delete("/planitem", async (req,res)=>{
    const {planid, planitemid} = req.query;
    if (!planid || !planitemid) {
        return res.status(400).send({ Message: "Plan ID and Plan Item ID are required", Success: false });
    }
    try {
        await Plan.findByIdAndUpdate(planid, {
            $pull: {planitems: planitemid}
        })
        await PlanItem.findByIdAndDelete(planitemid)
        return res.status(200).send({Message: "Plan item deleted", Success: true})
    } catch (error) {
        console.error("Error deleting plan item: ", error);
        return res.status(500).send({Message: "Error deleting plan item", Success: false})
        
    }
})

module.exports = route;
