const express = require("express");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserRouter = express.Router();
require("dotenv").config();
UserRouter.get("/",(req,res)=>{
    res.send("User")
})

UserRouter.post("/register",(req,res)=>{
    const {name,email,password,address} = req.body;
    // console.log(req.body);
    try {
        bcrypt.hash(password,10,async(err,hash)=>{
            const user = new User({name:name,email:email,password:hash,address:address});
            await user.save();
            res.send("Signup Success");
        })
    } catch (error) {
        console.log("Problem in Signup");
    }
})
UserRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    // console.log(req.body);
    try {
        const user = await User.findOne({email:email})
        // console.log(user);
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    const token = jwt.sign({"userID":user._id},process.env.SECRET_KEY)
                    res.send({"msg":"Login Success","token":token})
                }else{
                    res.send("Invalid Token")
                }
            })
        }else{
            res.send("Invalid Detail")
        }
    } catch (error) {
        console.log("Problem in Login");
    }
})

UserRouter.patch("/user/:id/reset",async(req,res)=>{
    const {curr_password,new_password} = req.body;
    const id = req.params.id;
    
    const user  = await User.findOne({_id:id});
    if(user){
        console.log(user.password);
        bcrypt.compare(curr_password,user.password,(err,result)=>{
            if(result){
                try {
                    bcrypt.hash(new_password,10,async(err,hash)=>{
                        await User.findByIdAndUpdate({_id:id},{password:hash});
                        res.send("Updated Success");
                    })
                } catch (error) {
                    console.log("Problem in Reset Password");
                }
            }
            else{
                res.send("Password Does not Matched")
            }
        })
    }else{
        res.send("User Does not exist")
    }
    
})
module.exports={
    UserRouter
}