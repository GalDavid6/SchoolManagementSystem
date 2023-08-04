const AsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const dbConnect = AsyncHandler(async() => {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfully");
});

dbConnect();