const mongoose = require('mongoose');
const mongoURI="mongodb://localhost:27017/iNotebook";

async function connectToMongo(){
    await mongoose.connect(mongoURI).then(()=>
        console.log("Connected to Mongo successfully")).catch(err=>console.log(err));
}

module.exports = connectToMongo;


