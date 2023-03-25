const express  = require('express');
const { connection } = require('./connection/db');
const { auth } = require('./middleware/auth');
const { OrderRouter } = require('./routes/Order.route');
const { RestaurentRouter } = require('./routes/Restaurent.route');
const { UserRouter } = require('./routes/User.route');
const app = express();
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Welcome to Food App")
})

app.use("/api",UserRouter);
app.use("/api/restaurents",RestaurentRouter);

app.use(auth)
app.use("/api/orders",OrderRouter);

app.listen(8081,async()=>{
    try {
        await connection;
        console.log("DB Connected");
        console.log("server is running on port 8081");
    } catch (error) {
        console.log(error);
    }
})