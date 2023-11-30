const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat');
const User = require('../models/user');

//create a new chat or access an existing chat
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if(!userId){
        console.log('no user id')
        return res.status(400) 
    }
  //get chat if it exists
    var isChat = await Chat.find({ 
        isGroup : false,
        $and : [
            {users :{$elemMatch : { $eq : req.user._id}}},
            {users :{$elemMatch : { $eq : userId}}},
        ]
    }).populate("users","-password").populate("latestMessage")//

    //populate the sender of the latest message
    isChat = await User.populate(isChat,{path : "latestMessage.sender",select : "-password"})
    if(isChat.length > 0){
        res.send(isChat[0])
    }else {
        var chatData = {
            chatName :"sender",
            isGroup : false,
            users : [req.user._id,userId],
        }
        try {
            const newChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({_id : newChat._id}).populate("users","-password")
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

//fetch all chats of a user
const fetchChats = asyncHandler(async (req, res) => {
    try{
        Chat.find({users :{$elemMatch : { $eq : req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
         .sort({updatedAt : -1})
         .then(async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name pic email",
            });
            res.status(200).send(results);
        });
    }catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})

//create a new group chat
const createGroupChat = asyncHandler(async (req, res) => {
    if(!req.body.users || !req.body.chatName){
        return res.status(400).send('pls fill all fields')
    }
    var users = JSON.parse(req.body.users)
    if (users.length < 2) {
        return res.status(400).send('pls add more users')
    }
    users.push(req.user)
    try {
        const newChat = await Chat.create({
            chatName : req.body.chatName,
            isGroup : true,
            users : users,
            groupAdmin : req.user._id
        })
        const fullChat = await Chat.findOne({_id : newChat._id})
           .populate("users","-password")
           .populate("groupAdmin","-password")
        res.status(200).send(fullChat)
    }catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})

//rename a group chat
const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
  
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  });

//add a user to a group chat
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body; 
    const added = await Chat.findByIdAndUpdate(chatId , 
        {
            $push : {users : userId}
        },
        {
            new : true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    if (!added){
        res.status(404)
        throw new Error('Chat Not Found')
    } else {
        res.json(added)
    }
});

//remove a user from a group chat
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body; 
    const removed = await Chat.findByIdAndUpdate(chatId , 
        {
            $pull : {users : userId}
        },
        {
            new : true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    if (!removed){
        res.status(404)
        throw new Error('Chat Not Found')
    } else {
        res.json(removed)
    }
});
module.exports= {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}