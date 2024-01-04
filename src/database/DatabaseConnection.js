import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connect = await mongoose.connect(
      "mongodb+srv://softwareengineer23:softwareengineer23@cluster0.sa2sdwq.mongodb.net/bpo?retryWrites=true&w=majority"
    );
    if (connect) {
      console.log("Express connected to mongodb");
    }
  } catch (error) {
    console.log(error);
  }
}
