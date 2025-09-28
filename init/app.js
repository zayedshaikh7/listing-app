const mongoose=require("mongoose");
const inData = require("./data.js")
const Listing=require("../models/listing.js");
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
    
} 
main(). then(()=>{
    console.log("connected")
}).catch((err)=>{
console.log(err)
})

const initDb = async()=>{
    await Listing.deleteMany({})
    inData.data = inData.data.map((obj) => ({...obj, owner:"68b1be6aafa0a266f76d47c6"}))
    await Listing.insertMany(inData.data)
    console.log("kaam ho gaya")
}
initDb();