import { connect } from "mongoose";
require('dotenv').config()

const connectDB = async () => {
  try {
    const mongoURI: any = process.env.DATABASE 
    const options: any = {
      dbName: "tph-quest",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await connect(mongoURI, options);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;