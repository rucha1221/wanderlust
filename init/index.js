const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() =>{
    console.log("Connected Successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner: '6a4f44c5958e8e346c89ab93'
    }));
    await Listing.insertMany(initData.data);
    console.log("Sample Data Inserted.");
}
initDB();