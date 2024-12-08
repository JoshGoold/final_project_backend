const express = require("express");
const User = require("../../models/UserSchema");

const route = express.Router();

route.get("/user", async (req, res) => {
  const { id } = req.query;

  try {
    const user = await User.findById(id)
      .populate("income")
      .populate({
        path: "budgets", 
        populate: {path: "expenses"}
    })
      .populate({
        path: "savings",
        populate: {path: "deposits"}
    })
      .populate({
        path: "plans", 
        populate: { path: "planitems" } 
    })
      .lean();
    if (!user)
      return res
        .status(404)
        .send({ Message: `No user found with id: ${id}`, Success: false });

    return res.status(200).send({ Message: "User located", Success: true, User: user });
  } catch (error) {
    console.error("Error locating user by id: ", error);
    res
      .status(500)
      .send({
        Message: "Server error while finding user by id",
        Success: false,
      });
  }
});

module.exports = route;
