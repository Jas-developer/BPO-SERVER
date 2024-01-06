import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  jobs: [String],
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
