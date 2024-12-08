const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config();
const authroute = require("./routes/user/auth")
const userRoute = require("./routes/user/getUser")
const savingRoute = require('./routes/savings/savingsRoutes')
const planRoute = require("./routes/plans/plansRoutes")
const incomeRoute = require("./routes/income/incomeRoutes")
const budgetRoute = require('./routes/budgets/budgetsRoutes')

const app = express()

app.use('/', authroute)
app.use('/', userRoute)
app.use('/', savingRoute)
app.use('/', planRoute)
app.use('/', incomeRoute)
app.use('/', budgetRoute)

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.DB_CONNECT)
.then(()=> {
    console.log("DATABASE CONNECTED")
    app.listen(process.env.PORT, ()=> console.log(`SERVER STARTED\nVIEW HERE: http://localhost:${process.env.PORT}`))
})
.catch(e=> console.log("Error connecting to database: %d",e))

app.get("/", (req,res)=>{
    res.send("Server running")
})

module.exports = app;