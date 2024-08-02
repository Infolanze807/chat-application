const mongoose = require("mongoose");

const url = `mongodb+srv://chat_app_admin:chat_app_admin@cluster0.l1jihyy.mongodb.net/`;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Conneted to DB")). catch((e)=> console.log("Error",e))