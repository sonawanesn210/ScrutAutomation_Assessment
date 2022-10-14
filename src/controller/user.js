
const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const multer = require('multer'); 
const amqp = require("amqplib");
const app = express();
const user = require('../model/user')
const uploadFile=require('./aws')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any())


mongoose.connect("mongodb+srv://sonavanesn1996:Swapnali210@cluster0.ds0ir.mongodb.net/scrutAssignment"
, {
    useNewUrlParser: true
})
.then( () => console.log("MongoDB is connected sucessfully"))
.catch ( err => console.log(err) )

var connection, channel
//Connects to the rabbitMQ Server and Creates a Queue for USERS 
async function connectRabbitMQ() {
    // Note:- Need to connect rabbitMQ Server, to access the Channel 
    const amqpServer = "amqp://localhost:5672";
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("USERS")
    }
    connectRabbitMQ()



const isValidField = (name) => {
    return  /^[a-zA-Z]/.test(name.trim());
  };

  const isValidString = (String) => {
    return /\d/.test(String)
  }

app.post('/register',async (req, res)  => {
    try {
        let data = req.body
        let files=req.files
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter data" });
        }
  
        if (!data.name) {
            return res.status(400).send({ status: false, message: "Name is required" });
        }
        if(!isValidField(data.name)){
            return res.status(400).send({ status: false, message: "Invalid format of name" }) }

            if(isValidString(data.name)){
                return res.status(400).send({ status: false, message: "name should not contains number" }) }
        if (!data.age) {
            return res.status(400).send({ status: false, message: "Age is required" });
        }
        if(!isValidString(data.age)){
            return res.status(400).send({ status: false, message: "age should be number" }) }
        
        
          if(!files.length){
                return res.status(400).send({ status: false, message: "profileImage is required" }); 
            } 
            let uploading = await uploadFile.uploadFile(files[0]);
              data.file = uploading; 
        
        const result = await user.create(data)
        channel.sendToQueue(
             "USERS",
            Buffer.from(
                JSON.stringify({
                    result
                })
            ) 
        );
         
        console.log(result)
        res.status(201).send({ status: true, data: result }) 

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});


