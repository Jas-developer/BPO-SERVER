import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  jobs: [
    {
      title: String,
      image: String,
      salary: String,
      requirements: String,
      discription: String,
      imagePath: String,
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
