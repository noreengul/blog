const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app =  express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}

app.get("/posts",(req,res)=>{
    res.send(posts);
});

app.post("/posts",async(req,res)=>{
    const id = randomBytes(4).toString("hex");
    const title = req.body.title;
    
    posts[id]={
        id:id,
        title:title
    }

    await axios.post("http://localhost:4005/events",{
        type: "PostCreated",
        data: {
            id:id,
            title:title
        }
    });

    res.status(201).send(posts);
});

app.post("/events",(req,res)=>{
    console.log("Post Event Recived!");
    res.send("PostEvent Recived!");
});

app.listen(4000,()=>{
    console.log("post 4000 runing");
});