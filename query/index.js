const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app =  express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts",(req,res)=>{
    res.send(posts);
});

const handleEvent = (type, data) =>{

    if(type === "PostCreated"){

        posts[data.id] =  {
            id: data.id,
            title: data.title,
            comments: []
        };
        
    }

    if(type === "CommentCreated"){
        
        const {id, content, postId,status} = data;
        const post = posts[postId];
        post.comments.push({
            id: id,
            content :  content,
            status:status
        });
    }

    if(type === "CommentUpdated"){
        
        const {id, content, postId, status} = data;
        const post = posts[postId];
        const comment = post.comments.find((comment)=>{
            return comment.id === id;
        })
        comment.status = status;
        comment.content = content;
         
    }

}

app.post("/events",async(req,res)=>{

    const { type , data} = req.body;
    
    handleEvent(type,data);

    res.status(201).send("Event Reived");
});

app.listen(4003,async()=>{

    console.log("post 4003 runing");
    
    try {
        const res = await axios.get("http://localhost:4005/events");
    
        for (let event of res.data) {
          console.log("Processing event:", event.type);
    
          handleEvent(event.type, event.data);
        }
      } catch (error) {
        console.log(error.message);
      }
 
 });