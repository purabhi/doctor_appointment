import mongoose from "mongoose"

mongoose.connect('mongodb://localhost/doctor_appointment') //connection of dbms


//--------------------Schema for User Table---------------------//
const user_table = new mongoose.Schema({
    name: String,
    pass:String
});


export default mongoose.model("user", user_table);

