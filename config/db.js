const mongoose=require("mongoose");
const MONGO_URL="mongodb+srv://rajdeepsinghsethi215:PsaXyBPFlID1z1lz@cluster0.ajqmsmu.mongodb.net/?retryWrites=true&w=majority"
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    });
    console.log(`Connected to MongoDB Database ${mongoose.connection.host}`.bgBlack);
  } catch (error) {
    console.log(`MONGO Connect Error ${error}`.bgRed.white);
  }
};


module.exports = connectDB;
