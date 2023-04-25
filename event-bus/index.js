const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const eventData = [];

app.post("/events",async (req,res)=>{
    const { type, data} = req.body;

    eventData.push({type:type,data:data});

    await axios.post("http://localhost:4000/events",req.body);
    await axios.post("http://localhost:4001/events",req.body);
   
    await axios.post("http://localhost:4003/events",req.body);
    await axios.post("http://localhost:4002/events",req.body);   

    res.send("OK!");
});

app.get("/events",(req,res)=>{
    res.send(eventData);
});

app.listen(4005 , ()=>{
    console.log("Listening 4005 port event bus");
});